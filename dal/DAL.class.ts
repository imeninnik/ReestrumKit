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
        return this.session.knex.raw('SELECT 1')
            .catch((e) => {
                console.error('Error connecting to DB', e);
                throw e;
        });


    }



    constructor(dalSettings:DALI.IDALSettings) {

        this.knex = knex({
            client: dalSettings.client || 'pg',

            connection: {
                host : dalSettings.host || process.env.MAINDB_HOST || 'localhost',
                user : dalSettings.user || process.env.MAINDB_USER ||'postgres',
                port: dalSettings.port || parseInt(process.env.MAINDB_PORT) || 5432,
                password : dalSettings.password || process.env.MAINDB_PASS ||'password',
                database : dalSettings.database || process.env.MAINDB_DBNAME ||'reestrum',
                application_name: dalSettings.application_name || process.env.RKI_APP_NAME || 'tstApplicationName!!!!!!'
            },
            // pool:{
            //     afterCreate: (conn, done) => {
            //         console.log('conn, done', conn, done);
            //     }
            // }

            // connection: `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}?application_name=${application_name}`;
            // connection: `postgres://postgres:pass@localhost:5432/reestrum?application_name=testApplicationName`


    });


    }


}
