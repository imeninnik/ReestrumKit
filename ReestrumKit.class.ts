import * as rki from './reestrumKit.interfaces';
import * as restI from './restServer/restServer.interfaces';
import { DAL, Models } from "./dal";
import { Server } from './restServer';
import QueueAccessLayer from "./qal/QueueAccessLayer.class";
import IO from './IO/IO.class';
import RestClient from './restClient/RestClient.class';
import Logger from './logger/Logger.class';
import * as Helpers from './helpers';
import { IRKSettings, IRKSettings_DAL } from "./reestrumKit.interfaces";
import * as IDALSettings from "./dal/DAL.interfaces";
import * as glob from "glob";



export default class ReestrumKit {
    public BL: any;
    public logLevel: number = 0;
    //public static get Models() { return Models }

    public Models: any = {};
    private settings: rki.IRKSettings = {dal:{}, qal:{}, logger:{}, restServer:{}, restClient:{}};
    private _qal: any;
    private _IOClass: any;
    public logger: Logger;
    // private _Models: any = {};

    public restServer: any;


    constructor(private serviceName:string,  settings = null, BL?:Function) {
        if (settings) this.settings = Object.assign(this.settings, settings);
        // this.logger = new Logger(this.serviceName, process.env.NODE_ENV );

        if (settings.logLevel) this.logLevel = settings.logLevel;


        if (BL && typeof BL == 'function') this.BL = BL(this);

        this.Models = Object.assign(this.Models, Models);


    }

    public get name() { return this.serviceName }

    //public get Models() { return this._Models }
    public get qal() { return this._qal }
    public get IO() { return this._IOClass }
    public get restClient() { return RestClient }
    public get Helpers() { return Helpers }

    public async init() {
        const m = await DAL.Init(this.settings.dal).catch(e => console.log('TODO Handle this DB Error'));
        this.Models = Object.assign(this.Models, m);

        this.logger = new Logger(this.serviceName, process.env.NODE_ENV );
        this.logger.level = this.logLevel;


        const s:restI.IRestServerOptions = this.settings.restServer;

        if (process.env.RK_REST_SERVER && process.env.RK_REST_SERVER == 'true') await this._initRest(s);
        // this.restServer = new Server(this, s.port ,s.apiPath,s.apiVersion,s.basePathToRESTFolder);
        // await this.restServer.init();



        // this._qal = new QueueAccessLayer(this);
        // await this._qal.init().catch(e => console.log('TODO Handle this MQ Error'));


        this._IOClass = new IO(this);

        return;
    }

    public async die() {
        this.restServer.stop();

    }


    private async _initRest(s) {
        try {
            const port = s.port || parseInt(process.env.RK_REST_SERVER_PORT)  || 8090;
            const apiPath = s.apiPath || process.env.RK_REST_API_PATH || 'api';
            const apiVersion =  s.apiVersion || process.env.RK_REST_API_VERSION || '1';
            const basePathToRESTFolder = s.basePathToRESTFolder || process.env.RK_REST_API_FOLDER || './REST';
            const useCoreRESTFolder = s.useCoreRESTFolder || process.env.RK_REST_USE_CORE_REST_FOLDER || 'true';
            this.restServer = new Server(this, port, apiPath, apiVersion, basePathToRESTFolder, !!useCoreRESTFolder);
            await this.restServer.init();
        } catch (e) {
            console.log(e);
            throw e;
        }

    }
}