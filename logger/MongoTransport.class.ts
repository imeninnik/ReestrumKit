export default class MongoTransport {
    constructor(private _model) {}

    public save(logMessage) {
        if (!process.env.GT_LOGS_TO_MONGO) return;
        const m = new this._model(logMessage);
        m.save();
    }
}