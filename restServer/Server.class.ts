import * as glob from 'glob';
import * as http from 'http';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as cluster from 'cluster';
import * as os from 'os';

import { IRestRule, IRestRulesBase } from './restServer.interfaces';

const numCPUs = os.cpus().length;

export default class Server {
    public fullAPIPath: string = '';
    private expressApp: express.Application;
    private server/*:http.Server*/;
    private _cluster: number;
    _secured?:string;

    constructor(
        private gtInstance: any,
        private port: number = 8080,
        private apiPath: string = 'api',
        private apiVersion: string = 'v1',
        private basePathToRESTFolder: string = './REST'
    ) {
        this.expressApp = express();
        this._cluster = parseInt(process.env.GT_CLUSTER) || 0;



        this.composeFullAPIPath();
    }

    public async init() {
        this.expressApp.disable('x-powered-by');

        this.expressApp.set('port', this.port);

        this._cluster
            ? await this._initCluster()
            : await this._initSingleNode();


        this.initMiddleware();
        await this.initRoutes();
        await this.start();

        return;

    }


    public async start() {
        return new Promise((resolve, reject) => {

            if (this.server) this.server.listen(this.port, () => {

                this._secured
                    ? this.gtInstance.logger.info("#RestServerClass > Secured server started on port  " + this.port)
                    : this.gtInstance.logger.info("#RestServerClass > Server started on port " + this.port);

                return resolve();
            });

            if (this.server) this.server.on("error", (err: Error) => {
                console.error("#RestServerClass > Error starting server" + err);
                reject(err)
            });


        });

    }

    public stop() {
        return this.server.close();
    }

    private _initCluster() {
        let clusterAmount;

        (this._cluster >= numCPUs)
            ? clusterAmount = numCPUs-1
            : clusterAmount = this._cluster;

        if (cluster.isMaster) {
            this.gtInstance.logger.info(`Init ${clusterAmount} nodes cluster`);
            this.gtInstance.logger.info(`Master ${process.pid} is running`);

            // Fork workers.
            for (let i = 0; i < clusterAmount; i++) {
                this.gtInstance.logger.log(`Init node ${i+1} of ${clusterAmount}`);
                cluster.fork();
            }

            cluster.on('exit', (worker, code, signal) => {
                this.gtInstance.logger.info(`worker ${worker.process.pid} died`);
            });
        } else {
            this.gtInstance.logger.log(`Worker ${process.pid} started`);
            return this._initSingleNode();


        }
    }

    private _initSingleNode() {
        this._secured = process.env.GT_USE_TLS;

        if (this._secured) {
            const TSL_KEY_PATH = process.env.RK_TSL_KEY_PATH || 'C:\\SSL\\key.pem';
            const TSL_CERT_PATH = process.env.RK_TSL_CERT_PATH || 'C:\\SSL\\cert.pem';

            // curl -k https://localhost:8000/
            const https = require('https');
            const fs = require('fs');

            const options = {
                key: fs.readFileSync(TSL_KEY_PATH),
                cert: fs.readFileSync(TSL_CERT_PATH)
            };

            this.server = https.createServer(options, this.expressApp);
        } else {
            this.gtInstance.logger.info('Init Single Node Server');
            this.server = http.createServer(this.expressApp);
        }

        return;
    }

    private initMiddleware(): void {
        this.expressApp.use(cors());
        this.expressApp.use(bodyParser.json());
        this.expressApp.use(bodyParser.text());
        this.expressApp.use(bodyParser.urlencoded({ extended: false }));
    }

    private async initRoutes() {
        return new Promise((resolve, reject) => {
            const requireFiles = [];

            this.expressApp.get('/', (req, res, next) => {
                res.json({
                    success: true,
                    message: `API base path ${this.fullAPIPath}`
                });
            });


            glob(`${this.basePathToRESTFolder}/**/*.rest.ts`, {absolute:true}, (err, files) => {
                if (err || !files.length) {
                    this.gtInstance.logger.error(err||'no rest files!');
                    this.gtInstance.logger.log(`\t basePathToRESTFolder: ${this.basePathToRESTFolder}`);
                    return;
                }

                files.forEach((f,i) => {
                    requireFiles[i] = require(f)
                });

                this.gtInstance.logger.trace(`\n\n==== Apply REST Rules`);
                requireFiles.forEach((rq:IRestRulesBase) => {
                    rq.restRules.forEach((restRule:IRestRule) => {
                        const basePath = restRule.basePath ? `/${restRule.basePath}/` : '/';

                        const finalPath = this.fullAPIPath + basePath+restRule.path;
                        this.gtInstance.logger.trace(`REST > ${restRule.method} > ${finalPath} \t (${restRule.description})`);

                        this.addRoutes(
                            restRule.method,
                            finalPath,
                            restRule.controller(this.gtInstance)
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