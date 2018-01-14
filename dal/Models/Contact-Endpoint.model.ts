import BasicModel from './_Basic.model';
import * as ENUMS from './ENUM.modelTypes';

export default class Person2 extends BasicModel {
    protected static tableName = 'contact_endpoints';
    protected static pKey = ['id','type','value'];
    protected static pKeyType = 'uuid';
    protected static autoGeneratePKey = true;
    protected static trackDateAndTime = true;


    public id: string;
    public person_uuid: string;
    public type: ENUMS.contact_endpoints_types;
    public value: string;
    public verified: boolean;
    public verification_id: string;

    public updated_at: string;
    public created_at: string;

    constructor() {
        super();


    }

}


