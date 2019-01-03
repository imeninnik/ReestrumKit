export default class PostgresTransport {
    constructor(private _model) {}

    public save(logMessage) {
        if (!process.env.GT_LOGS_TO_PG) return;
        const m = new this._model(logMessage);
        m.save();
    }
}