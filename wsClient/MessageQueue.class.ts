const { Observable, Subject, ReplaySubject, from, of, range } = require('rxjs');

class Message {
    public responded: number = 0;
    public delivered: boolean = false;
    constructor(public id: string, public value: any, public outgoing: boolean = true, public date = new Date() ) {
        // this.date = new Date();
    }
    public respond() {  this.responded++;    }
}

const RETRIES_TIMES = 10000;
const INTERVAL_SEC = 20;
const TIME_DIFF_TO_DELETE = 60 * 1000;

export default class MessageQueue {
    private _queue = new Map();

    constructor(private _gtInstance?) {
        setInterval(() => this._clearQueue() , 1000 * INTERVAL_SEC);
    }

    public get size() { return this._queue.size }

    public get(messageId) {
        const m = this._queue.get(messageId);
        return m.value;
    }

    public set(messageId, value, outgoing, date?: Date) {
        const m = new Message(messageId, value, outgoing, date);
        return this._queue.set(messageId, m);
    }


    // public set(messageIdOrModel, value, outgoing) {
    //     if (messageIdOrModel instanceof Message) {
    //         const messageModel = messageIdOrModel;
    //         return this._queue.set(messageModel.id, messageModel);
    //     }
    //
    //     const messageId = messageIdOrModel.uuid;
    //     const m = new Message(messageId, value, outgoing);
    //     return this._queue.set(messageId, m);
    // }


    public getFullMessage(messageId) {
        return this._queue.get(messageId);
    }


    public delete(messageId) {
        return this._queue.delete(messageId);
    }

    public deleteAll(ensure: string) {
        if (ensure !== 'yes, I know') return;

        return this._queue = new Map();
    }

    public has(messageId) {
        return this._queue.has(messageId);
    }

    public entries(messageId) {
        return this._queue.entries();
    }

    public ack(messageId) {
        let m = this._queue.get(messageId);
        if (!m) return;

        m.delivered = true;
        this._queue.set(messageId, m);
        return;
    }

    /**
     * connection.on('message'... will upload message to _queue.
     * Here we check that queue with some periodic for corresponding message to appear
     * @param messageId
     * @returns {Promise<Message>}
     */
    public watchForResponse(messageId): Promise<Message> {
        const that = this;
        return new Promise((resolve, reject) => {

            let i = 0;
            let checkResp = function checkResp(messageId) {
                i++;
                if ( that._queue.has(messageId) && that._queue.get(messageId).value ) {
                    const m = that._queue.get(messageId);
                    resolve(m);
                    m.respond();
                    return;
                } else {
                    if (i > RETRIES_TIMES)
                        return reject('Response timeout error for messageId > '+ messageId);
                    setTimeout(() => checkResp(messageId),0);
                }
            };

            checkResp(messageId);

        });
    }

    public _clearQueue() {
        const currTime = new Date().getTime();
        this._queue.forEach((m:Message)  => {
            // should be delivered, but this does not matter for bridgeAddress
            const delivered = (m.delivered || (!m.delivered && m.id === 'bridgeAddress') || (!m.delivered && m.id === 'gateway') );

            if ( delivered && m.responded && currTime - m.date.getTime()  > TIME_DIFF_TO_DELETE)
                this._queue.delete(m.id);
            if (delivered && !m.responded && currTime - m.date.getTime()  > (TIME_DIFF_TO_DELETE * 5)) {
                this._gtInstance.logger.warn('#MessageQueue > #Unanswered message > deleting', m);
                this._queue.delete(m.id);
            }

            if (!delivered && m.id !== 'bridgeAddress' && parseInt(m.id,16) >= 127) this._gtInstance.logger.warn(`#MessageQueue > message "${m.id}" is not delivered!`);
        });

        // to test queue uncomment below
        // console.warn(`\n\n===============\n\n`, this._queue.size );
        // console.warn(`\n\n---\n\n`, this._queue );
    }


}