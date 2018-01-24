import SMS from './SMS/SMS.class'

export default class IO {

    private _smsClass: any;

    constructor(rkInstance) {
        this._smsClass = new SMS(rkInstance);
    }

    public get sms() { return this._smsClass }
}