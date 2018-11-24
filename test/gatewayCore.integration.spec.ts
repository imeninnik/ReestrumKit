import ReestrumKit from '../ReestrumKit.class';



const PORT = 9001;
const restSettings = {
    port: PORT,
    apiPath: 'api',
    apiVersion: '1',
    basePathToRESTFolder:'./core/REST/'
};

const basePath = `http://localhost:${PORT}/${restSettings.apiPath}/${restSettings.apiVersion}/test`;
const serviceName = 'gatewayTest';
let rk;

beforeAll(async () => {
    rk = new ReestrumKit(serviceName,{ restServer:restSettings });
    await rk.init();
});

afterAll(async () => {
    await rk.die();
});

describe('Test REST Server and REST Client', ()=>{

    test('GET call', async () => {
        jest.setTimeout(10000);
        let getRes = await rk.restClient.get(basePath);

        getRes = JSON.parse(getRes as string);

        expect(getRes['success']).toBeTruthy();
        expect(getRes['method']).toBe('get');

    });

    test('POST call', async () => {
        jest.setTimeout(10000);
        let postRes = await rk.restClient.post(basePath);

        postRes = JSON.parse(postRes as string);

        expect(postRes['success']).toBeTruthy();
        expect(postRes['method']).toBe('post');

    });

    test('POST call with string message', async () => {
        jest.setTimeout(10000);
        const string = 'some string here';
        let postRes = await rk.restClient.post(basePath, string, {'Content-Type': 'text/plain'});

        postRes = JSON.parse(postRes as string);

        expect(postRes['success']).toBeTruthy();
        expect(postRes['method']).toBe('post');
        expect(postRes['body']).toEqual(string);

    });

    test('POST call with string message alias', async () => {
        jest.setTimeout(10000);
        const string = 'some string here';
        let postRes = await rk.restClient.postString(basePath, string);

        postRes = JSON.parse(postRes as string);

        expect(postRes['success']).toBeTruthy();
        expect(postRes['method']).toBe('post');
        expect(postRes['body']).toEqual(string);

    });

    test('POST call with string object', async () => {
        jest.setTimeout(10000);
        const obj = {a: 1};
        let postRes = await rk.restClient.post(basePath, obj);

        postRes = JSON.parse(postRes as string);

        expect(postRes['success']).toBeTruthy();
        expect(postRes['method']).toBe('post');
        expect(postRes['body']).toEqual(obj);

    });
});







