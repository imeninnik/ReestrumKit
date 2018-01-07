import * as glob from 'glob';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { IRestRule, IRestRulesBase } from './restServer.interfaces';
import Throw = Chai.Throw;

export default class Server {
    public fullAPIPath: string = '';
    private expressApp: express.Application;

    constructor(
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
        this.initMiddleware();
        this.initRoutes();
        this.start()
    }


    public start() {
        this.expressApp.listen(this.port, () => {
            console.info(`Server listening on port ${this.port}`);
        });
    }

    private initMiddleware(): void {
        this.expressApp.use(bodyParser.json());
        this.expressApp.use(bodyParser.urlencoded({ extended: false }));
    }

    private async initRoutes() {
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

            requireFiles.forEach((rq:IRestRulesBase) => {
                rq.restRules.forEach((restRule:IRestRule) => {
                    const basePath = restRule.basePath ? `/${restRule.basePath}/` : '/';

                    const finalPath = this.fullAPIPath + basePath+restRule.path;

                    console.log(`\n\n REST > ${restRule.method} > ${finalPath} \t (${restRule.description})`);

                    this.addRoutes(
                        restRule.method,
                        finalPath,
                        restRule.controller
                    )
                });
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