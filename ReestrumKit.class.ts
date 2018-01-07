import * as rki from './reestrumKit.interfaces';
import * as restI from './restServer/restServer.interfaces';
import { DAL, Models } from "./dal";
import { Server } from './restServer';

export default class ReestrumKit {

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

        this.restServer = new Server(s.port ,s.apiPath,s.apiVersion,s.basePathToRESTFolder);
        this.restServer.init();
        return DAL.Init(this.settings.dal);

    }

    public async die() {
        this.restServer.stop();

    }
}