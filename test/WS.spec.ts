import { getFreePorts, nextAvailable } from 'node-port-check';

const http = require('http');
import * as WebSocket from 'websocket';
import RK from '../ReestrumKit.class';
const WebSocketServer = WebSocket.server;
import WSServer from './../wsServer/WSServer.class';
import WSClient from "../wsClient/WSClient.class";


process.env.GT_WS_INSTEAD_OF_REST = 'true';

let i, allPorts;
let WSPORT = 8888;
const testUrl = `ws://localhost`;
const serviceName = 'gatewayTest';
let rk, wsServer;


beforeAll(async () => {
    i = 0;
    allPorts = await getFreePorts(20, '127.0.0.1');
});

beforeEach(async () => {
    WSPORT = allPorts[i];

    rk = new RK(serviceName);
    rk.loggerLevel = 0;
    await rk.init();
    const token = process.env.GT_CMS_TOKEN || await rk.settings.get('token');
    rk.wsClients['cms'] = new WSClient(rk, 'cms', `${testUrl}:${WSPORT}`, token );

    wsServer = new WSServer(rk, WSPORT);
});

afterEach(async () => {
    wsServer.stop();
    await rk.die();
    i++;
});

describe('Test WS Messaging with (CMS Client)', () => {

    test('Connect to WS and get response with Bridge Address', async () => {
        jest.setTimeout(10000);

        const connectMessage = JSON.stringify({"bridgeAddress": "DEV:TEST_CASE_ADDRESS"});

        await wsServer.init(connectMessage);
        let connectResp = await rk.wsClients['cms'].connect( 'bridgeAddress');

        expect(connectResp).toHaveProperty('bridgeAddress');

    });

    test('Put outcoming message id in queue', async () => {
        jest.setTimeout(10000);
        await wsServer.init();
        await rk.wsClients['cms'].connect( 'bridgeAddress');

        const initalQueueLength = rk.wsClients['cms']['_messageQueue'].size;

        const postResp = rk.wsClients['cms'].post(`${testUrl}:${WSPORT}`, null, rk.Helpers.getUUID(), 'here we are');

        const oneNextQueueLength = rk.wsClients['cms']['_messageQueue'].size;

        rk.wsClients['cms'].post( null, rk.Helpers.getUUID(), 'here we are2');
        rk.wsClients['cms'].post( null, rk.Helpers.getUUID(), 'here we are3');

        const threeNextQueueLength = rk.wsClients['cms']['_messageQueue'].size;

        expect( oneNextQueueLength - initalQueueLength ).toEqual(1);
        expect( threeNextQueueLength - initalQueueLength ).toEqual(3);


    });

    test('Put incoming message id in queue', async () => {
        jest.setTimeout(10000);
        await wsServer.init();
        await rk.wsClients['cms'].connect( 'bridgeAddress');

        const uuid = rk.Helpers.getUUID();
        const initialState = rk.wsClients['cms']['_messageQueue'].has(uuid);

        const testMessage = {
            "uri": "devices",
            "method": "post",
            uuid,
            "type": "ack",
            "status": 200
        };

        await wsServer.send( JSON.stringify(testMessage) );

        let messageResult;
        rk.wsClients['cms']['_incomeQueue$'].subscribe((message) => {
            console.log(message);
            messageResult = message
        });

        await rk.Helpers.sleep(500);

        console.log(messageResult);

        expect(messageResult).toEqual(testMessage)


    });

});





