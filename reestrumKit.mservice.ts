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


    ///



    // let cep = new r.Models.ContactEndpoint();
    // cep.value = '0';
    // cep.type = 'phone';
    // cep.verified = true;
    // await cep.save();
    //
    // let cp = await r.Models.ContactEndpoint.GetOneByKeys({type:'phone', value: '0991006566'});
    // console.log(cp);



    // r.IO.sms.send();
}

