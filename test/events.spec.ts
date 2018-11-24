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

describe('Events', ()=>{

    test('Should subscribe and emit simple data', async () => {
        jest.setTimeout(10000);

        const outcomeMessage = 'test message';

        rk.events.on('testEvent', (incomeMessage) => {
           expect(incomeMessage).toEqual(outcomeMessage);
        });


        rk.events.emit('testEvent', outcomeMessage);

    });



});



