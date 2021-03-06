import BasicModel from './_Basic.model';
import DAL from "../DAL.class";

const DEFAULT_NEW_USER = {
    roles: ['user'],
    verified: false
};

export default class User extends BasicModel {
    protected static tableName = 'users';
    protected static pKey = 'id';
    protected static pKeyType = 'uuid';
    protected static autoGeneratePKey = true;
    protected static trackDateAndTime = true;


    public id: string;
    public verified: boolean;
    public person_id: string;
    public crypto_id: string;
    public password: string;
    public roles: string[];
    public last_logon: Date;
    public last_logout: Date;


    constructor(userObj = DEFAULT_NEW_USER) {
        super();

        //if (userObj.email) console.log('EMAIL > ', userObj.email);

         userObj.hasOwnProperty('verified')
             ? this.verified = userObj['verified']
             : this.verified = false;

        // add default roles or use special ones
        ( userObj.roles && Array.isArray(userObj.roles) )
            ? this.roles = userObj.roles
            : this.roles = ['user'];


    }

    public async verify() {
        this.verified = true;
        return this.save();
    }

    public async getCrypto() {
        const knex = DAL.session.knex;
        const crytpos = await knex('cryptos')
            .select()
            .whereRaw(` id = '${this.crypto_id}'  `);

        if (!crytpos.length) return null;

        return crytpos[0];
    }

    static async VerifyByContactEndPoint(type: string, value: string|number): Promise<any/*Person | null*/ > {
        const knex = DAL.session.knex;

        const contactEndpoins = await knex('contact_endpoints')
            .select()
            .whereRaw(` type = '${type}' and value = '${value}' `);

        if (!contactEndpoins.length) return null;

        const userId = contactEndpoins[0].user_id;

        const users =  await knex(this.tableName)
            .select()
            .whereRaw(` id = '${userId}' `);

        const user = User.ToModel(users, true);
        await user.verify();

        return user;
    }

    static async GetOneByContactEndPoint(type: string, value: string|number): Promise<User | null > {
        const knex = DAL.session.knex;

        const contactEndpoins = await knex('contact_endpoints')
            .select()
            .whereRaw(` type = '${type}' and value = '${value}' `);

        if (!contactEndpoins.length) return null;

        const userId = contactEndpoins[0].user_id;

        const users =  await knex(this.tableName)
            .select()
            .whereRaw(` id = '${userId}' `);

        const user = User.ToModel(users, true);
        await user.verify();

        return user;
    }



}


