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

    process.env.DBG_QUERY = true;


    let cp = await r.Models.ContactEndpoint.GetOneByKeys({type:'phone', value: '0991006566'});
    console.log(cp);

}

