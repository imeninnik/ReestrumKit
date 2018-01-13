import * as rki from './reestrumKit.interfaces';
import * as restI from './restServer/restServer.interfaces';
import { DAL, Models } from "./dal";
import { Server } from './restServer';

export default class ReestrumKit {

    public static get Models() { return Models }

    private settings: rki.IRKSettings = {dal:{},qal:{},logger:{},restServer:{},restClient:{}};
    public restServer: any;

    constructor(private serviceName:string,  settings?) {
        if (settings) this.settings = Object.assign(this.settings, settings);
        //console.log(settings);
    }

    public get name() { return this.serviceName }

    public get Models() { return Models }

    public async init() {
        const s:restI.IRestServerOptions = this.settings.restServer;

        this.restServer = new Server(this, s.port ,s.apiPath,s.apiVersion,s.basePathToRESTFolder);
        await this.restServer.init();
        await DAL.Init(this.settings.dal);
        return;

    }

    public async die() {
        this.restServer.stop();

    }
}