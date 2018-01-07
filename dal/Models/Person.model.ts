import BasicModel from './_Basic.model';

export default class Person extends BasicModel {
    protected static tableName = 'persons';
    protected static pKey = 'id';
    protected static pKeyType = 'uuid';
    protected static autoGeneratePkey = true;


    public id:string;
    public main_phone: string;

    constructor() {
        super();
    }

}


