import BasicModel from './_Basic.model';
import * as ENUMS from './ENUM.modelTypes';

export default class ContactEndpoint extends BasicModel {
    protected static tableName = 'contact_endpoints';
    protected static pKey = ['type','value'];
    protected static trackDateAndTime = true;


    public person_uuid: string;
    public type: 'phone' | 'email' | 'address';
    public value: string;
    public verified: boolean;
    public verification_id: string;

    public updated_at: string;
    public created_at: string;

    constructor() {
        super();


    }

}


