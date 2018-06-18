const http = require('http');
const https = require('https');
const { URL } = require('url');
const querystring = require('querystring');

export default class RestClient {
    protected static protocols = { http,https };

    public static async post(url, data?, headers?) {
        const parsedUrl = new URL(url);
        return this.request('POST', parsedUrl)
    }

    public static async get(url, data?, headers?) {
        const parsedUrl = new URL(url);
        return this.request('GET', parsedUrl);
    }


    private static request(method, urlOptions, data={}, inputHeaders?) {
        return new Promise((resolve, reject) => {
            const messageData = querystring.stringify(data);

            const defaultHeaders = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(messageData)
            };

            const headers =  inputHeaders ? inputHeaders : defaultHeaders;
            const options = Object.assign(urlOptions, {headers}, {method});

            const protocol = options['protocol'].slice(0,-1);

            const req = this.protocols[protocol].request(options, (res) => {
                // console.log(`STATUS: ${res.statusCode}`);
                // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
                res.setEncoding('utf8');
                res.on('data', (chunk) => {
                    // console.log(`BODY: ${chunk}`);
                    resolve(chunk);
                });
                res.on('end', () => {
                    console.log('No more data in response.');
                    return
                });
            });

            req.on('error', (e) => {
                console.error(`problem with request: ${e.message}`);
                return reject(e.message);
            });

            // write data to request body
            req.write(messageData);
            req.end();
        });

    }
}