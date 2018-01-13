import * as chai from 'chai';
// import * as sinon from 'sinon';
const chaiAsPromised = require("chai-as-promised");
let chaiHttp = require('chai-http');
const expect = chai.expect;
const assert = chai.assert;

chai.use(chaiAsPromised);
chai.use(chaiHttp);
chai.should();

import ReestrumKit from './../../ReestrumKit.class';

let r;

beforeEach(async () => {
    process.env.TEST_CASE = true;
    const serviceName = 'dal';

    r = new ReestrumKit(serviceName);

    await r.init();
});

describe('DAL Person Model', function() {
    this.timeout(10000);

    it('Create instance of Person', async() => {

        process.env.DBG_QUERY = true;

        let person = new r.Models.Person();

        const personId = person.id;

        await person.save();


        expect(personId).to.be.length(36);
        expect(person.created_at).to.be;
        expect(personId.updated_at).to.be

    });




});

