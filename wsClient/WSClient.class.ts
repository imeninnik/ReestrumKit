import MessageQueue from './MessageQueue.class';
import * as WebSocket from 'websocket';


import {retry} from "rxjs/operators";

const { Observable, Subject, ReplaySubject, from, of, range } = require('rxjs');

interface IWSPayload {
    method: string,
    uri: string,
    uuid: string,
    message: any
}

const WebSocketClient = WebSocket.client;

const legalMethods = ['post','patch','put','get','delete'];

export default class WSClient {
    private _client = new WebSocketClient();
    private _connection;
    private _messageQueue:MessageQueue = new MessageQueue(this._rkInstance);
    private _incomeQueue$ = new Subject();

    public logger;

    constructor(private _rkInstance, public name: string, readonly _baseURL = '', private _protocol = '', private _token = '') {
        this.logger = _rkInstance.logger;

        if (_token) this._baseURL += '?token='+_token;

        this._rkInstance.logger.trace(`#WSClient > constructor > "${this.name}" created`);
    }


    public async connect(initMessageId, doNotWaitForResponse: boolean = false) {
        this._rkInstance.logger.trace(`#WSClient > "${this.name}" > connect > ${initMessageId}`);

        await this._callConnection(this._baseURL).catch(e => {
            throw e
        });

        if (!doNotWaitForResponse) return this._responder(initMessageId);

        this._responder(initMessageId);
        return true;

    }

    private async _responder(messageId) {
        const m = await this._messageQueue.watchForResponse(messageId);
        return m.value;
    }

    private _callConnection(url) {
        return new Promise((resolve, reject) => {
            this._client.connect(url, this._protocol);

            this._client.on('connectFailed', (error) =>  {
                const message = "Connection Error: " + error.toString();
                this.logger.warn(message);
                return reject(message);
            });

            this._client.on('connect', (connection) => {
                if (!this._connection) this._connection = connection;

                this.logger.log(`#WSClient > ${this.name} > WebSocket Client Connected`);
                connection.on('error', (error) => {
                    const message = "Connection Error: " + error.toString();
                    this.logger.warn(message);
                    return reject(message);
                });
                connection.on('close', () =>
                    this.logger.warn(`#WSClient > ${this.name} > WS Connection Closed!`)
                );

                this._connection.on('message', (message) => {
                    if (message.type === 'utf8') {
                        this.logger.trace(`WS received new message: ${message.utf8Data}`, new Date().getTime());
                        this._handleIncomeMessage(message.utf8Data);
                        return resolve();
                    }
                });

                return resolve();
            });
        });
    }


    public async post(uri = '', uuid:string, message?: any) {
        const method = 'post';
        const payload:IWSPayload = {
            method,
            uri,
            uuid,
            message
        };
        this._rkInstance.logger.trace(`#WSClient > #${this.name} > post > `, uri);
        this._call(this._baseURL, payload);
        return this._responder(uuid);
    }

    public async quickPost(message: string ) {
        const method = 'post';
        const payload = {
            method,
            uri: '',
            uuid: 'quickPost_'+this._rkInstance.Helpers.getUUID(),
            message
        };
        this._connection.send( JSON.stringify(payload) );
        return this._responder(payload.uuid);
    }

    public async patch( uri = '', uuid:string, message?: any) {
        const method = 'patch';
        const payload = {
            method,
            uri,
            uuid,
            message
        };
        this._call(this._baseURL, payload);
        return this._responder(uuid);
    }

    public async delete(uri = '', uuid:string, message?: any) {
        const method = 'delete';
        const payload = {
            method,
            uri,
            uuid,
            message
        };

        this._call(this._baseURL, payload);
        return this._responder(uuid);
    }

    public async stop() {
        return this._client.abort();
    }

    public get messagesStream$() {
        return this._incomeQueue$;
    }

    private _call(baseUrl:string, payload: IWSPayload) {
        if (!this._connection) {
            this._rkInstance.logger.error(`#WSClient > #${this.name} > _call > there is no connection!`);
            throw `No WS connection! Possible reason: gateway['cms'].connect('bridgeAddress') action missed.`
        }
        try {
            this._connection.send( JSON.stringify( payload )  );
            this._messageQueue.set(payload.uuid, null, true);
            this._rkInstance.logger.log(`#WSClient > #${this.name} > #send \x1b[32m>>>>>\x1b[0m  "${payload.method}" to "${payload.uri}" > message id: "${payload.uuid}" `);

        } catch (e) {
            throw e
        }
    }

    private _handleIncomeMessage(message: string) {
        let m;
        // message should be stringified JSON
        try { m = JSON.parse(message); }
        catch (e) {
            this._rkInstance.logger.error(`#WSClient > #${this.name} > # _handleIncomeMessage > wrong message format. Expected stringified object`, message);
            // return this._acknowledge(message, 400);
            return
        }

        // if it is a bridge, just log (and copy to queue?)
        if (m.bridgeAddress) {
            this._messageQueue.set('bridgeAddress', m, false);
            this._incomeQueue$.next(m);
            return this._rkInstance.logger.log(`#WSClient > #${this.name} > #receive \x1b[35m<<<<<\x1b[0m ${message} `);
        }

        // if it is a gateway , just log (and copy to queue?)
        if (m.gateway) {
            this._messageQueue.set('gateway', m, false);
            this._incomeQueue$.next(m);
            return this._rkInstance.logger.log(`#WSClient > #${this.name} > #receive \x1b[35m<<<<<\x1b[0m ${message} `);
        }


        // if it is a messageManager
        if (m.messageManager) {
            // this._messageQueue.set('messageManager', m, false);
            this._incomeQueue$.next(m);
            return this._rkInstance.logger.log(`#WSClient > #${this.name} > #receive from MessageManager \x1b[35m<<<<<\x1b[0m ${message} `);
        }

        // if it is not a bridge, then we expect message to have uuid and method and uri
        if (!m.uuid || typeof m.method != "string" ) {
            this._rkInstance.logger.log(`#WSClient > #${this.name} > #receive \x1b[31m<<<<<\x1b[0m  ${JSON.stringify(m)} `);
            return

        }


        // if it is acknowledgement to a message that we NOT send previously
        if (m.type && m.type === 'ack' && m.status === 200 &&  this._messageQueue.has(m.uuid) === false) {
            this._incomeQueue$.next(m);
            this._rkInstance.logger.log(`#WSClient > #${this.name} > #ack \x1b[37m<<<<<\x1b[0m  "${m.method}" to "${m.uri}" > message id: "${m.uuid}" `);

            return this._rkInstance.logger.warn(`#WSClient > #${this.name} > #_handleIncomeMessage > acknowledge to message that is not in queue!`,m.uuid);

        }

        // we receive ack from cms
        if (m.type && m.type === 'ack' && m.status === 200 &&  this._messageQueue.has(m.uuid) === true) {
            this._messageQueue.set(m.uuid, m, false);
            this._messageQueue.ack(m.uuid);
            this._rkInstance.logger.log(`#WSClient > #${this.name} > #ack \x1b[37m<<<<<\x1b[0m  "${m.method}" to "${m.uri}" > message id: "${m.uuid}" `);

            return;
        }

        // handle income error
        if (m.type && m.type === 'error') {
            this._rkInstance.logger.log(`#WSClient > #${this.name} > #receive \x1b[35m<\x1b[32m<<<<\x1b[0m  "${m.method}" to "${m.uri}" > message id: "${m.uuid}" `);
            this._incomeQueue$.next(m);
            this._messageQueue.set(m.uuid, m, false);
            this._acknowledge(m);
        }

        // if it is task message like post, put, delete, etc
        if (m.uri && m.method) {
            this._rkInstance.logger.log(`#WSClient > #${this.name} > #receive \x1b[32m<<<<<\x1b[0m  "${m.method}" to "${m.uri}" > message id: "${m.uuid}" `);
            this._incomeQueue$.next(m);
            //this._messageQueue.set(m.uuid, m, false);
            this._acknowledge(m);
        }



    }

    private _acknowledge(incomeMessage, errorCode?:number) {
        const ack/*: IAckMessage*/ = {
            uri: incomeMessage.uri,
            method: incomeMessage.message,
            uuid: incomeMessage.uuid,
            type: errorCode ? 'error' : 'ack',
            status:  errorCode || 200
        };


        if ( errorCode ) {
            this._rkInstance.logger.log(`#WSClient > #${this.name} > #error \x1b[31m>\x1b[37m>>>>\x1b[0m  "${incomeMessage.uuid}" \x1b[0m`);
        } else {
            this._rkInstance.logger.log(`#WSClient > #${this.name} > #ack \x1b[37m>>>>>\x1b[0m  "${incomeMessage.uuid}" \x1b[0m`);
        }


        this._connection.send( JSON.stringify(ack) );

    }

}

