import BasicModel from './_Basic.model';

export default class User extends BasicModel {
    protected static tableName = 'user';
    protected static pKey = 'id';
    protected static pKeyType = 'uuid';
    protected static autoGeneratePKey = true;
    protected static trackDateAndTime = true;


    public id: string;
    public verified: boolean;
    public person_id: string;
    public crypto_id: string;
    public password: string;
    public roles: string[];
    public last_logon: Date;
    public last_logout: Date;


    constructor(userObj) {
        super();

        if (userObj.email) console.log('EMAIL > ', userObj.email);

        console.log('Check for person');
        console.log('create pass and salt');
        console.log('send email');
    }



}


