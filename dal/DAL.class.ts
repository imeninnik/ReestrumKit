import * as knex  from 'knex';
import * as glob from 'glob';
import * as Helpers from './Helpers';
import { IDALSettings } from './DAL.interfaces';
import { IRKSettings, IRKSettings_DAL } from "./../reestrumKit.interfaces";


export default class DAL {

    public static session: any;


    private static _inited: boolean = false;
    private static _initing: boolean = false;

    private knex: any;


    public static get Helpers() {
        return Helpers;
    }

    public static async Init(dalSettings:IDALSettings) {
        let models = {};
        const requireFiles = [];

        if (!dalSettings.pathToModels) dalSettings.pathToModels =  __dirname+'/Models';
        if (!dalSettings.client) dalSettings.client =  'pg';
        if (!dalSettings.host) dalSettings.host = 'localhost';
        if (!dalSettings.user) dalSettings.user = 'postgres';
        if (!dalSettings.password) dalSettings.password = 'password';

        console.log(dalSettings.pathToModels);

        glob(`${dalSettings['pathToModels']}/**/*.pg.model.ts`, {absolute:true}, (err, files) => {
            if (err || !files.length) {
                console.error(err || 'no model files!');
                return;
            }

            files.forEach((f, i) =>
                requireFiles[i] = require(f).default
            );

            requireFiles.forEach(rk => {
                let obj = {};
                obj[rk.name] = rk;
                models = Object.assign(models, obj)

            });

        });
            /////////////////


        try {
            this.session = new DAL(dalSettings);
        } catch (e) {
            console.log(11,e);
            throw e;
        }
        return this.session.knex.raw('SELECT 1')
            .then(() => models)
            .catch((e) => {
                console.error('Error connecting to DB', e);
                throw e;
            });


    }



    constructor(dalSettings: IDALSettings) {

        this.knex = knex({
            client: dalSettings.client || 'pg',

            connection: {
                host : dalSettings.host || process.env.RK_MAINDB_HOST || 'localhost',
                database : dalSettings.database || process.env.RK_MAINDB_DBNAME || 'postgres',
                user : dalSettings.user || process.env.RK_MAINDB_USER ||'postgres',
                port: dalSettings.port || parseInt(process.env.RK_MAINDB_PORT) || 5432,
                password : dalSettings.password || process.env.RK_MAINDB_PASS ||'password',
                //application_name:
                //application_name: dalSettings.application_name || process.env.RK_APP_NAME || 'tstApplicationName!!!!!!'
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
