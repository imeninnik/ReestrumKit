import BasicModel from './_Basic.model';

export default class Verify extends BasicModel {
    protected static tableName = 'verifies';
    protected static pKey = 'id';
    protected static pKeyType = 'uuid';
    protected static autoGeneratePKey = true;
    protected static trackDateAndTime = true;


    public id: string;
    public agent_id: string;
    public campaign_id: string;
    public customer_id: string;
    public type: string;
    public verify_code: string;
    public valid_until: Date;
    public attempts: number;
    public status: string;



    constructor() {
        super();

        if (typeof this.attempts === 'undefined') this.attempts = 0;
        if (typeof this.status === 'undefined') this.status = 'new';
    }



}


