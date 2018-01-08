import * as glob from 'glob';
import * as http from 'http';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { IRestRule, IRestRulesBase } from './restServer.interfaces';


export default class Server {
    public fullAPIPath: string = '';
    private expressApp: express.Application;
    private server/*:http.Server*/;


    constructor(
        private rkInstance: any,
        private port: number = 8082,
        private apiPath: string = 'api',
        private apiVersion: string = 'v1',
        private basePathToRESTFolder: string = './REST'
    ) {
        this.expressApp = express();

        this.composeFullAPIPath();
    }

    public async init() {

        this.expressApp.set('port', this.port);
        this.server = http.createServer(this.expressApp);


        this.initMiddleware();
        await this.initRoutes();
        return this.start();



    }


    public async start() {
        return new Promise((resolve, reject) => {

            this.server.listen(this.port);
            this.server.on("error", (err: Error) => {
                console.error("#RestServerClass > Error starting server" + err);
                reject(err)
            });

            this.server.on("listening", () => {
                console.log("#RestServerClass > Server started on port " + this.port);
                return resolve();
            });
        });

    }

    public stop() {
        this.server.close();
    }

    private initMiddleware(): void {
        this.expressApp.use(bodyParser.json());
        this.expressApp.use(bodyParser.urlencoded({ extended: false }));
    }

    private async initRoutes() {
        return new Promise((resolve, reject) => {
            let requireFiles = [];

            this.expressApp.get('/', (req, res, next) => {
                res.json({
                    success: true,
                    message: `API base path ${this.fullAPIPath}`
                });
            });


            glob(`${this.basePathToRESTFolder}/**/*.rest.ts`, {absolute:true}, (err, files) => {
                if (err || !files.length) {
                    console.error(err||'no rest files!');
                    return;
                }

                files.forEach((f,i) => {
                    requireFiles[i] = require(f)
                });

                console.log(`\n\n==== Apply REST Rules`);
                requireFiles.forEach((rq:IRestRulesBase) => {
                    rq.restRules.forEach((restRule:IRestRule) => {
                        const basePath = restRule.basePath ? `/${restRule.basePath}/` : '/';

                        const finalPath = this.fullAPIPath + basePath+restRule.path;

                        console.log(`REST > ${restRule.method} > ${finalPath} \t (${restRule.description})`);

                        this.addRoutes(
                            restRule.method,
                            finalPath,
                            restRule.controller(this.rkInstance)
                        );

                    });
                });

                return resolve();

            });

        });

    }

    private composeFullAPIPath() {
        const port = this.port ? `:${this.port}` : ``;
        const apiPath = this.apiPath ? `/${this.apiPath}` : ``;
        const apiVersion = this.apiVersion ? `/${this.apiVersion}` : ``;

        this.fullAPIPath = `${apiPath}${apiVersion}`;

    }

    private addRoutes(method:string = 'post', route: string, handler: Function): void {
        this.expressApp[method](`${route}`, handler);
    }
}