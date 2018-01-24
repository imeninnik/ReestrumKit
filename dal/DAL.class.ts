import * as knex  from 'knex';
import * as Helpers from './Helpers';
import * as DALI from './DAL.interfaces';


export default class DAL {

    public static session: any;


    private static _inited: boolean = false;
    private static _initing: boolean = false;

    private knex: any;


    public static get Helpers() {
        return Helpers;
    }

    public static async Init(dalSettings:DALI.IDALSettings) {
        this.session = new DAL(dalSettings);
        return;
    }



    constructor(dalSettings:DALI.IDALSettings) {

        this.knex = knex({
            client: dalSettings.client || 'pg',

            connection: {
                host : dalSettings.host || 'localhost',
                user : dalSettings.user || 'postgres',
                password : dalSettings.password || 'pass',
                database : dalSettings.database || 'reestrum',
                application_name: dalSettings.application_name || 'tstApplicationName!!!!!!'
            }


            // connection: `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}?application_name=${application_name}`;
            // connection: `postgres://postgres:pass@localhost:5432/reestrum?application_name=testApplicationName`


    });


    }


}
