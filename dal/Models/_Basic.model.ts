import DAL from './../DAL.class';

export default class BasicModel {

    protected static tableName:string = null;
    protected static pKey:string = null;
    protected static pKeyType:string = null;
    protected static autoGeneratePkey:boolean = false;


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

        const pKey = model.constructor['pKey'];
        const tableName  = model.constructor.tableName;

        const insertQuery = knex(tableName).insert(model).toString();

        const updateQuery = knex(tableName)
            .update(model)
            .whereRaw(`${tableName}.${pKey} = '${model[pKey]}'`)
            .toString().replace(/^update\s.*\sset\s/i, '');


        const finalQuery = `${ insertQuery } ON CONFLICT (${pKey}) DO UPDATE SET ${updateQuery}`;

        return knex.raw(finalQuery);
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

        if ( pKey && !this[pKey] ) this.handlePrimaryKey();
    }

    public async save() {
        return BasicModel.Upsert(this);
    }

    public async delete() {
        return BasicModel.Delete(this)
    }

    private handlePrimaryKey() {
        const pKey = this.constructor['pKey'];
        const pKeyType = this.constructor['pKeyType'];
        const autoGeneratePkey = this.constructor['autoGeneratePkey'];

        if (pKeyType === 'uuid' && autoGeneratePkey) this[pKey] = DAL.Helpers.getUUID()

    }
}