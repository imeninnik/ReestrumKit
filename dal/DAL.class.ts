import * as knex  from 'knex';
import * as Helpers from './Helpers';


export default class DAL {

    public static session: any;


    private static _inited: boolean = false;
    private static _initing: boolean = false;

    private knex: any;


    public static get Helpers() {
        return Helpers;
    }

    public static async Init(dalSettings) {
        this.session = new DAL(dalSettings);
        return;
    }



    constructor(dalSettings) {

        this.knex = knex({
            client: dalSettings.client || 'pg',

            connection: {
                host : dalSettings.host || 'localhost',
                user : dalSettings.user || 'postgres',
                password : dalSettings.password || 'pass',
                database : dalSettings.database || 'reestrum'
            }
        });

    }


}
