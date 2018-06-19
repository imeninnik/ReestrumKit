import * as rki from './reestrumKit.interfaces';
import * as restI from './restServer/restServer.interfaces';
import { DAL, Models } from "./dal";
import { Server } from './restServer';
import QueueAccessLayer from "./qal/QueueAccessLayer.class";
import IO from './IO/IO.class';
import RestClient from './restClient/RestClient.class';
import * as Helpers from './helpers';


export default class ReestrumKit {
    public BL: any;
    public static get Models() { return Models }

    private settings: rki.IRKSettings = {dal:{},qal:{},logger:{},restServer:{},restClient:{}};
    private _qal: any;
    private _IOClass: any;

    public restServer: any;


    constructor(private serviceName:string,  settings = null, BL?:Function) {
        if (settings) this.settings = Object.assign(this.settings, settings);

        if (BL && typeof BL == 'function') this.BL = BL(this);

    }

    public get name() { return this.serviceName }

    public get Models() { return Models }
    public get qal() { return this._qal }
    public get IO() { return this._IOClass }
    public get restClient() { return RestClient }
    public get Helpers() { return Helpers }

    public async init() {
        const s:restI.IRestServerOptions = this.settings.restServer;

        this.restServer = new Server(this, s.port ,s.apiPath,s.apiVersion,s.basePathToRESTFolder);
        await this.restServer.init();
        await DAL.Init(this.settings.dal);

        this._qal = new QueueAccessLayer(this);
        await this._qal.init();

        this._IOClass = new IO(this);


        return;

    }

    public async die() {
        this.restServer.stop();

    }
}