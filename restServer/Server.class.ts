import * as glob from 'glob';
import * as http from 'http';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cluster from 'cluster';
import * as os from 'os';

import { IRestRule, IRestRulesBase } from './restServer.interfaces';

const numCPUs = os.cpus().length;

export default class Server {
    public fullAPIPath: string = '';
    private expressApp: express.Application;
    private server/*:http.Server*/;
    private _cluster: number;

    constructor(
        private rkInstance: any,
        private port: number = 8082,
        private apiPath: string = 'api',
        private apiVersion: string = 'v1',
        private basePathToRESTFolder: string = './REST'
    ) {
        this.expressApp = express();
        this._cluster = parseInt(process.env.RK_CLUSTER) || 0;



        this.composeFullAPIPath();
    }

    public async init() {

        this.expressApp.set('port', this.port);

        this._cluster
            ? this._initCluster()
            : this._initSingleNode();

        this.server = http.createServer(this.expressApp);

        this.initMiddleware();
        await this.initRoutes();
        await this.start();

        /////////

        ////////

        return;

    }


    public async start() {
        return new Promise((resolve, reject) => {

            this.server.listen(this.port, ()=> {
                console.log("#RestServerClass > Server started on port " + this.port);
                return resolve();
            });

            this.server.on("error", (err: Error) => {
                console.error("#RestServerClass > Error starting server" + err);
                reject(err)
            });


        });

    }

    public stop() {
        this.server.close();
    }

    private _initCluster() {
        let clusterAmount;

        (this._cluster >= numCPUs)
            ? clusterAmount = numCPUs-1
            : clusterAmount = this._cluster;

        console.log(`Init Cluster of ${clusterAmount}`);

        if (cluster.isMaster) {
            console.log(`Master ${process.pid} is running`);

            // Fork workers.
            for (let i = 0; i < clusterAmount; i++) {
                cluster.fork();
            }

            cluster.on('exit', (worker, code, signal) => {
                console.log(`worker ${worker.process.pid} died`);
            });
        } else {
            // Workers can share any TCP connection
            // In this case it is an HTTP server
            // http.createServer((req, res) => {
            //     res.writeHead(200);
            //     res.end('hello world\n');
            // }).listen(8000);

            this._initSingleNode();

            console.log(`Worker ${process.pid} started`);
        }
    }

    private _initSingleNode() {
        console.log('Init Single Node Server');
        this.server = http.createServer(this.expressApp);
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