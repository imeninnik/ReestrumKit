import BasicModel from './_Basic.model';
import DAL from "../DAL.class";
import ContactEndpoint from "./ContactEndpoint.model";

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

    static async GetOneByContactEndPoint(type: string, value: string|number): Promise<Person | null > {
        const knex = DAL.session.knex;

        const oneRecord = await knex('contact_endpoints')
            .select()
            .whereRaw(`type = '${type}' and value = '${value}'`);

        if (!oneRecord.length) return null;

        const oneRecordModel = ContactEndpoint.ToModel(oneRecord, true);

        return oneRecordModel;
    }

}


