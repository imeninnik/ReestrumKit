import ReestrumKit from './ReestrumKit.class';


run();

async function run() {
    const serviceName = 'verifier';

    const restServerSettings = {
        port: 8000,
        apiPath: 'api-path',
        apiVersion: 'api-version',
        basePathToRESTFolder:'./REST/'
    };

    const r = new ReestrumKit(serviceName,{ restServer:restServerSettings });

    await r.init();
}

