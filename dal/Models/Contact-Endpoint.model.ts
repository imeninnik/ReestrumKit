import BasicModel from './_Basic.model';
import * as ENUMS from './ENUM.modelTypes';
import DAL from './../DAL.class';


export default class ContactEndpoint extends BasicModel {
    protected static tableName = 'contact_endpoints';
    protected static pKey = ['type','value'];
    protected static trackDateAndTime = true;


    public person_id: string;
    public type: ENUMS.contact_endpoints_types;
    public value: string;
    public verified: boolean;
    public verification_id: string;

    public updated_at: string;
    public created_at: string;

    constructor() {
        super();

        if (typeof this.verified === 'undefined') this.verified = false;

    }

    public static async FindOneByTypeAndValue(type, value) {
        const knex = DAL.session.knex;

        const oneRecord = await knex(this.tableName)
            .select()
            .whereRaw(`type = '${type}' and value = '${value}'`);

        const oneRecordModel = ContactEndpoint.ToModel(oneRecord, true);

        return oneRecordModel;
    }

}


