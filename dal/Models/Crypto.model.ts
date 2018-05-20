import BasicModel from './_Basic.model';

export default class User extends BasicModel {
    protected static tableName = 'crypto';
    protected static pKey = 'id';
    protected static pKeyType = 'uuid';
    protected static autoGeneratePKey = true;
    protected static trackDateAndTime = true;


    public id: string;
    public value: string;
    public type: string;


    constructor() {
        super();


    }



}


