var WebSocketServer = require('websocket').server;
var http = require('http');

const DEFAULT_ONCONECTION_STRING = JSON.stringify({"bridgeAddress": "DEV:TEST_CASE_ADDRESS"});

export default class WSServer {
    private _server;
    private _wsServer;
    private _connection;
    private _protocol: string;

    constructor(private _gtInstance, private _port) {
        this._server = http.createServer(function(request, response) {
            console.log((new Date()) + ' Received request for ' + request.url);
            response.writeHead(404);
            response.end();
        });

        this._wsServer = new WebSocketServer({
            httpServer: this._server,
            // You should not use autoAcceptConnections for production
            // applications, as it defeats all standard cross-origin protection
            // facilities built into the protocol and the browser.  You should
            // *always* verify the connection's origin and decide whether or not
            // to accept it.
            autoAcceptConnections: false
        });
    }

    public async init(onConnectionString = DEFAULT_ONCONECTION_STRING, onMessage?:Function, protocol = '') {
        return new Promise((resolve, reject) => {

            this._protocol = protocol.toLowerCase();

            this._server.listen(this._port, () => {
                this._gtInstance.logger.trace(`#WSServer > #init > listen > Server is listening on port ${this._port}`);
                resolve();
            });

            this._wsServer.on('request', (request) => {
                if (!this._originIsAllowed(request.origin)) {
                    // Make sure we only accept requests from an allowed origin
                    request.reject();
                    this._gtInstance.logger.trace(`#WSServer > #init > on request > Connection from origin ` + request.origin + ' rejected.');
                    return;
                }

                this._connection = request.accept(this._protocol, request.origin);
                this._gtInstance.logger.trace(`#WSServer > ${this._port} > #init > Connection accepted.`);
                this.send(onConnectionString);


                let onMessageFunction = onMessage || this._defaultOnMessageFunction;

                this._connection.on('message', onMessageFunction.bind(this));

                this._connection.on('close', (reasonCode, description) => {
                    this._gtInstance.logger.trace(`#WSServer > #init > on close > Peer ` + this._connection.remoteAddress + ' disconnected.');
                });

                this._connection.send( onConnectionString );

                // // todo remove this
                // let indx = 0;
                // const  mockedAnswer =[
                //     {"payloads_ul":{"id":1537795093022,"deveui":"001a79a00000002f","timestamp":"2018-09-24T13:18:13.022Z","devaddr":'000a00022',"live":true,"dataFrame":"5A0DAWbSRgD/3C4AMgAfAwQAAAAAAAAAAAEAMDAuMDAuMDACADAxLjA0LjAwAG0=","fcnt":7264,"port":1,"rssi":-37,"snr":10.5,"freq":868300000,"sf_used":7,"dr_used":"SF7BW125","cr_used":"4/5","device_redundancy":1,"time_on_air_ms":112.896,"gtw_info":null,"decrypted":true}},
                //     {"payloads_ul":{"id":1537795093023,"deveui":"001a79a000000025","timestamp":"2018-09-24T13:18:13.022Z","devaddr":'000a00023',"live":true,"dataFrame":"5A0DAWbSRgD/3C4AMgAfAwQAAAAAAAAAAAEAMDAuMDAuMDACADAxLjA0LjAwAG0=","fcnt":7264,"port":1,"rssi":-37,"snr":10.5,"freq":868300000,"sf_used":7,"dr_used":"SF7BW125","cr_used":"4/5","device_redundancy":1,"time_on_air_ms":112.896,"gtw_info":null,"decrypted":true}},
                //     {"payloads_ul":{"id":1537795093024,"deveui":"001a79a000000027","timestamp":"2018-09-24T13:18:13.022Z","devaddr":'000a00024',"live":true,"dataFrame":"5A0DAWbSRgD/3C4AMgAfAwQAAAAAAAAAAAEAMDAuMDAuMDACADAxLjA0LjAwAG0=","fcnt":7264,"port":1,"rssi":-37,"snr":10.5,"freq":868300000,"sf_used":7,"dr_used":"SF7BW125","cr_used":"4/5","device_redundancy":1,"time_on_air_ms":112.896,"gtw_info":null,"decrypted":true}},
                //     {"payloads_ul":{"id":1537795093025,"deveui":"001a79a000000028","timestamp":"2018-09-24T13:18:13.022Z","devaddr":'000a00025',"live":true,"dataFrame":"5A0DAWbSRgD/3C4AMgAfAwQAAAAAAAAAAAEAMDAuMDAuMDACADAxLjA0LjAwAG0=","fcnt":7264,"port":1,"rssi":-37,"snr":10.5,"freq":868300000,"sf_used":7,"dr_used":"SF7BW125","cr_used":"4/5","device_redundancy":1,"time_on_air_ms":112.896,"gtw_info":null,"decrypted":true}},
                //     {"payloads_ul":{"id":1537795093026,"deveui":"001a79a000000029","timestamp":"2018-09-24T13:18:13.022Z","devaddr":'000a00026',"live":true,"dataFrame":"5A0DAWbSRgD/3C4AMgAfAwQAAAAAAAAAAAEAMDAuMDAuMDACADAxLjA0LjAwAG0=","fcnt":7264,"port":1,"rssi":-37,"snr":10.5,"freq":868300000,"sf_used":7,"dr_used":"SF7BW125","cr_used":"4/5","device_redundancy":1,"time_on_air_ms":112.896,"gtw_info":null,"decrypted":true}}
                //
                // ];
                //
                // setInterval(() => {
                //     console.log('send default!!', indx);
                //     this._connection.send( JSON.stringify( mockedAnswer[indx] ));
                //     indx++
                // }, 40000);

            });
        });
    }

    public async send(message:string) {
        if (!message) message = 'undefined';

        if (!this._connection) return this._gtInstance.logger.warn(`#WSServer > ${this._port} > #send > no WS connection!`);

        this._gtInstance.logger.log(`#WSServer > ${this._port} > #send \x1b[32m>>>>>\x1b[0m`, message);
        return this._connection.send( message );
    }

    public async stop() {
        return this._wsServer.shutDown();
    }

    private _originIsAllowed(origin) {
        // put logic here to detect whether the specified origin is allowed.
        return true;
    }

    private _defaultOnMessageFunction(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            this._connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            this._connection.sendBytes(message.binaryData);
        }

    }

}



