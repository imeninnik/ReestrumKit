import LogMessage from './LogMessage.class';
import MongoTransport  from './MongoTransport.class';
import FileTransport  from './FileTransport.class';
import { Logs } from '../dal/Models/Log.mongoose.model';
import * as tracer from 'tracer';
import * as colors from 'colors';

export default class Logger {

    public level: number = 0;

    private _transports = [new MongoTransport(Logs), new FileTransport()];
    private _tracerTrace;
    private _tracerLog;
    private _tracerInfo;
    private _tracerWarn;


    constructor(private _component, private _env = process.env.NODE_ENV || 'dev') {
        this._tracerTrace = tracer.colorConsole({
            // format : "{{message}} \t({{timestamp}} in {{file}}:{{line}})",
            format : "{{message}}",
            dateformat : "HH:MM:ss.L",
            filters: [colors.gray]
        });
        this._tracerLog = tracer.colorConsole({
            // format : "{{message}} \t({{timestamp}} in {{file}}:{{line}})",
            format : "{{message}}",
            dateformat : "HH:MM:ss.L"
        });
        this._tracerInfo = tracer.colorConsole({
            // format : " {{message}} \t [{{title}}] ({{timestamp}} in {{file}}:{{line}})",
            format : " {{message}}",
            dateformat : "HH:MM:ss.L",
            filters : [colors.green],
        });
        this._tracerWarn = tracer.colorConsole({
            // format : " {{message}} \t [{{title}}] ({{timestamp}} in {{file}}:{{line}})",
            format : " {{message}}",
            dateformat : "HH:MM:ss.L"
        });
    }

    public trace(...args) {
        if (this.level < 4) return;
        // console.trace(...args);
        this._tracerTrace.log(...args);
        //this._tracerLog.trace(...args);
        const logMessage = new LogMessage({component: this._component, env: this._env, level: 4}, args, 'trace');

        return logMessage;
    }

    public log(...args) {
        if (this.level < 4) return;
        // console.log(...args);
        this._tracerLog.log(...args);
        const logMessage = new LogMessage({component: this._component, env: this._env, level: 3}, args, 'log');
        if (process.env.GT_PERSIST_LOW_LEVEL_LOGS) logMessage.save(...this._transports);

        return logMessage;
    }

    public dbg(...args) {
        if (this.level < 3) return;
        // console.log(...args);
        this._tracerLog.log(...args);
        const logMessage = new LogMessage({component: this._component, env: this._env, level: 3}, args, 'log');
        logMessage.save(...this._transports);

        return logMessage;
    }

    public info(...args) {
        if (this.level < 2) return;
        // console.info(...args);
        this._tracerInfo.info(...args);
        const logMessage = new LogMessage({component: this._component, env: this._env, level: 2}, args, 'info');
        logMessage.save(...this._transports);

        return logMessage;
    }

    public warn(...args) {
        if (this.level < 1) return;
        // console.warn(...args);
        this._tracerWarn.warn(...args);
        const logMessage = new LogMessage({component: this._component, env: this._env, level: 1}, args, 'warn');
        logMessage.save(...this._transports);

        return logMessage;
    }

    public error(...args) {
        const logMessage = new LogMessage({component: this._component, env: this._env, level: 0}, args, 'error');

        logMessage.toConsole();
        logMessage.save(...this._transports);

        return logMessage;
    }


}