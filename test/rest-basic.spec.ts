import BridgeCore from './../ReestrumKit.class';

const PORT = 9001;
const restSettings = {
    port: PORT,
    apiPath: 'api',
    apiVersion: '1',
    basePathToRESTFolder:'./REST/'
};
const basePath = `http://localhost:${PORT}/${restSettings.apiPath}/${restSettings.apiVersion}/test`;
const serviceName = 'bridgeTest';
let rk;

beforeAll(async ()=> {
    rk = new BridgeCore(serviceName,{ restServer:restSettings });
    await rk.init();
});

afterAll(async ()=> {
    await rk.die();
});

describe('Test REST Server and REST Client', () =>{

    test('GET call', async () => {
        jest.setTimeout(10000);
        let getRes = await rk.restClient.get(basePath);

        getRes = JSON.parse(getRes as string);

        expect(getRes['success']).toBeTruthy();
        expect(getRes['message']).toBe('get');

    });

    test('POST call', async () => {
        jest.setTimeout(10000);
        let postRes = await rk.restClient.post(basePath);

        postRes = JSON.parse(postRes as string);

        expect(postRes['success']).toBeTruthy();
        expect(postRes['message']).toBe('post');

    });
});



