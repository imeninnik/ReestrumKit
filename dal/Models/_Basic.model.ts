import DAL from './../DAL.class';
import * as BMHelpers from './../Helpers/BasicModel.helpers'

export default class BasicModel {

    protected static tableName:string = null;
    protected static pKey:string | string[] = null;
    protected static pKeyType:string = null;
    protected static autoGeneratePKey:boolean | string = false;

    public id?:string;
    public created_at?:string;
    public updated_at?:string;

    public static async GetAll():Promise<any> {
        const knex = DAL.session.knex;

        const all = await knex(this.tableName)
            .catch(e => console.log('GetAll', e));

        return this.ToModel(all);
    }

    public static async GetOneByKey(key): Promise<any> {
        const knex = DAL.session.knex;

        const one = await knex(this.tableName)
            .where(this.pKey, key)
            .catch(e => console.log('GetOneByKey', e));

        return this.ToModel(one, true);

    }

    public static async Upsert(model) {
        const knex = DAL.session.knex;

        const tableName  = model.constructor.tableName;

        const pKeys = BMHelpers.getPKeys(model.constructor['pKey']);
        const trackDateAndTime  = model.constructor['trackDateAndTime'];


        if (trackDateAndTime) model = this.updateDateAndTime(model);

        const insertQuery = knex(tableName).insert(model).toString();

        const updateQuery = pKeys
                ? knex(tableName)
                    .update(model)
                    .whereRaw( BMHelpers.prepareWhereStatmentForUpsert(pKeys, tableName, model)  )
                    .toString().replace(/^update\s.*\sset\s/i, '')
                : null;


        const finalQuery = updateQuery
            ? `${ insertQuery } ON CONFLICT (${[...pKeys]}) DO UPDATE SET ${updateQuery}`
            : `${ insertQuery }`;

        if (process.env.DBG_QUERY) console.log('Upsert > ',finalQuery);

        return knex.raw(finalQuery)
            .catch(e => console.log('Upsert error > ', e));
    }

    public static async Delete(model) {
        const knex = DAL.session.knex;

        const tableName  = model.constructor.tableName;

        const where = {};

        for (let key in model) {
            if (model.hasOwnProperty(key) )where[key] = model[key];
        }

        knex(tableName)
            .where(where)
            .del()
    }

    private static ToModel(rows:any[], one:boolean = false) {
        if (!rows.length) return [];

        if (one) {
            let tmpModel = new this();
            let oneModel = Object.assign(tmpModel,rows[0]);

            return new this(oneModel);
        }


        let rowsAsModels = [];

        rows.forEach(row => {
            let tmpModel = new this();
            let model = Object.assign(tmpModel, row);
            rowsAsModels.push( model );
        });

        return rowsAsModels;
    }

    constructor(obj?: any) {
        const pKey = this.constructor['pKey'];

        for (const property in obj) {
            this[property] = obj[property];
        }

        if ( pKey && !this[pKey] ) this.handlePrimaryKeyCreation();
    }

    public async save() {
        return BasicModel.Upsert(this);
    }

    public async delete() {
        return BasicModel.Delete(this)
    }




    private handlePrimaryKeyCreation() {
        const pKey = this.constructor['pKey'];
        const pKeyType = this.constructor['pKeyType'];
        const autoGeneratePKey = this.constructor['autoGeneratePKey'];

        if (Array.isArray(pKey) && pKeyType && autoGeneratePKey  ) {
            this[autoGeneratePKey] = DAL.Helpers.getUUID();
            console.error('Primary key logic is broken, cannot auto-generate pkey if there are more that one pkey. But will assume the first one is id');
        }

        if (!Array.isArray(pKey) && pKeyType === 'uuid' && autoGeneratePKey) this[pKey] = DAL.Helpers.getUUID();

    }

    private static updateDateAndTime(model) {
        if (!model.created_at) model.created_at = new Date().toISOString();
        model.updated_at = new Date().toISOString();
        return model;
    }
}