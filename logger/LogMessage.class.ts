import { ILogMessage, ILogMessageObject } from './logger.interfaces';

export default class LogMessage implements ILogMessage {
    id?: string;
    level: number;
    message: any;
    data: any;
    component: string;
    env: string;
    time: string;
    tags: string[] | number[] = [];

    constructor(messageObj: ILogMessageObject, _rawData: any, private _method: string) {
        const argsArr = Array.from(_rawData);
        this.level = messageObj.level;
        this.message = argsArr[0];
        this.data = argsArr.slice(1);
        this.component = messageObj.component;
        this.env = messageObj.env;
        this.time = new Date().toISOString();
        this._getTags(argsArr[0]);
    }

    public toConsole() {
        console[this._method](this.message, this.data || '');
        if (this._method == 'error') console.log(this);
    }

    public save(...transports) {
        transports.forEach(t => {
            t.save(this);
        });
    }

    private _getTags(firstArg) {
        if (typeof firstArg !== 'string') return;

        this.tags = firstArg.match(/#([a-zA-Z0-9])+/gi) || [];
        if (this.tags.length) this.tags.forEach((t,i) =>  this.tags[i] = t.slice(1));
    }
}