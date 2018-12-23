import ReestrumKit from './ReestrumKit.class';
import * as util from 'util';



run();

async function run() {
    const serviceName = 'verifier';

    const restServerSettings = {
        // port: 8000,
        apiPath: 'api-path',
        apiVersion: 'api-version',
        basePathToRESTFolder:'./REST/'
    };

    const r = new ReestrumKit(serviceName,{ restServer:restServerSettings, logLevel:5 });


    await r.init();

    process.env.DBG_QUERY = 'true';

    // const debuglog = util.debuglog('#rk-test');
    // debuglog('hello from foo [%d]', 123);

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


   // r.qal.tst()


}

