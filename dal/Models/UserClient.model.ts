import BasicModel from './_Basic.model';

const DEFAULT_NEW_USER = {
    roles: ['user'],
    verified: false
};

export default class User extends BasicModel {
    protected static tableName = 'user_clients';
    protected static pKey = ['id','fingerprint', 'token'];
    protected static pKeyType = 'uuid';
    protected static autoGeneratePKey = true;
    protected static trackDateAndTime = true;


    public id: string;
    public user_id: string;
    public fingerprint: string;
    public token: string;
    public authenticated: boolean;
    
    
    constructor() {
        super();

    }



}


