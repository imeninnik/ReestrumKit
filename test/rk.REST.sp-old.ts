import * as chai from 'chai';
// import * as sinon from 'sinon';
const chaiAsPromised = require("chai-as-promised");
let chaiHttp = require('chai-http');
const expect = chai.expect;
const assert = chai.assert;

chai.use(chaiAsPromised);
chai.use(chaiHttp);
chai.should();

import ReestrumKit from './../ReestrumKit.class';

beforeEach(() => {
    process.env.TEST_CASE = true;
});

describe('Reestrum Kit Instances', function() {
    this.timeout(10000);

    it('Should know right path from settings', async() => {
        const serviceName = 'restServer';
        const PORT = 9000;
        const API_PATH = 'api-path';
        const API_VERSION = 'api-version';
        const DEFAULT_VERSION = 'v1';

        const restServerSettings1 = {
            port: PORT,
            apiVersion: API_VERSION,
            apiPath: API_PATH,
        };
        const restServerSettings2 = {
            port: PORT+1,
            apiPath: '',
        };

        const r1 = new ReestrumKit(serviceName,{ restServer:restServerSettings1 });
        const r2 = new ReestrumKit(serviceName,{ restServer:restServerSettings2 });

        await r1.init();
        await r2.init();


        expect(r1.name).to.equal(serviceName);
        expect(r2.name).to.equal(serviceName);

        expect(r1.restServer.fullAPIPath).to.equal(`/${API_PATH}/${API_VERSION}`);
        expect(r2.restServer.fullAPIPath).to.equal(`/${DEFAULT_VERSION}`);

        await r1.die();
        await r2.die();

    });


    it('Should init correct paths', async() => {
        const serviceName = 'restServer';
        const PORT = 9000;
        const API_PATH = 'api-path';
        const API_VERSION = 'api-version';

        const restServerSettings = {
            port: PORT,
            apiVersion: API_VERSION,
            apiPath: API_PATH
        };

        const r = new ReestrumKit(serviceName,{ restServer:restServerSettings });

        await r.init();

        console.log(`http://localhost:${PORT}${r.restServer.fullAPIPath}/test`);


        let indexResponse = await chai.request(`http://localhost:${PORT}`).get('/');
        let testRootResponse = await chai.request(`http://localhost:${PORT}`).get(`${r.restServer.fullAPIPath}/test`);
        let testNotRootResponse = await chai.request(`http://localhost:${PORT}${r.restServer.fullAPIPath}`).get('/test/not-root');

        expect(indexResponse.body.success).to.equal(true);

        expect(testRootResponse.body.success).to.equal(true);
        expect(testRootResponse.body.message).to.equal('root');

        expect(testNotRootResponse.body.success).to.equal(true);
        expect(testNotRootResponse.body.message).to.equal('notRoot');

        await r.die();


    });


});

