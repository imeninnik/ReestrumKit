import SMS from './SMS/SMS.class'
import Email from './email/Email.class'

export default class IO {

    private _smsClass: any;
    private _emailClass: any;

    constructor(rkInstance) {
        this._smsClass = new SMS(rkInstance);
        this._emailClass = new Email()
    }

    public get sms() { return this._smsClass }
    public get email() { return this._emailClass }
}