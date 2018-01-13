import BasicModel from './_Basic.model';

export default class Person2 extends BasicModel {
    protected static tableName = 'persons2';
    protected static pKey = ['id','tst'];
    protected static pKeyType = 'uuid';
    protected static autoGeneratePKey = true;
    protected static trackDateAndTime = true;


    public tst: any;

    constructor() {
        super();


    }

}


