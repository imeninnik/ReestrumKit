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


    let person1 = new r.Models.Person();
    person1.tst = 1;
    // person1.lname = ['name1', 'name2'];
    person1.lname = 'name1';


    person1.save();
    console.log(56, person1);
}

