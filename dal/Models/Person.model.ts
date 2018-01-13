import BasicModel from './_Basic.model';

export default class Person extends BasicModel {
    protected static tableName = 'persons';
    protected static pKey = 'id';
    protected static pKeyType = 'uuid';
    protected static autoGeneratePKey = true;
    protected static trackDateAndTime = true;


    public tst: any;
    public lname: string;

    constructor() {
        super();


    }

}


