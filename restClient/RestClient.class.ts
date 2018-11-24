const http = require('http');
const https = require('https');
const Url = require('url');
const querystring = require('querystring');

export default class RestClient {
    protected static protocols = { http, https };

    public static async post(url, data?, headers?) {
        if (!url || !url.length) throw 'URL is not provided';
        // const parsedUrl = new URL(url);
        const parsedUrl = Url.parse(url, true);

        return this.request('POST', parsedUrl, data, headers)

    }

    public static async postString(url, string) {
        if (!url || !url.length) throw 'URL is not provided';
        // const parsedUrl = new URL(url);
        const parsedUrl = Url.parse(url, true);

        const headers = {'Content-Type': 'text/plain','Content-Length': Buffer.byteLength(string) };
        return this.request('POST', parsedUrl, string, headers)

    }

    public static async get(url, headers?) {
        if (!url || !url.length) throw 'URL is not provided';

        // const parsedUrl = new URL(url);
        const parsedUrl = Url.parse(url, true);
        return this.request('GET', parsedUrl, null, headers);
    }

    private static request(method, urlOptions, data = null, inputHeaders?) {
        return new Promise((resolve, reject) => {

            let messageData = (data && typeof data !== 'string') ? JSON.stringify(data) : data;


            const defaultHeaders = {
                'Content-Type': 'application/json',
                'Content-Length': data ? Buffer.byteLength(messageData) : 0
            };

            // const headers =  inputHeaders ? inputHeaders : defaultHeaders;
            const headers =  Object.assign(defaultHeaders, inputHeaders);
            const options = {
                headers,
                method,
                protocol: urlOptions.protocol,
                port: parseInt(urlOptions.port) || (urlOptions.protocol === 'https:' ? 443 : 80),
                path: urlOptions.path,
                hostname: urlOptions.hostname,
            };

            const protocol = options['protocol'].slice(0,-1);

            // handle form data
            if (options.headers['Content-Type'] === 'application/x-www-form-urlencoded') handleFormData();

            const req = this.protocols[protocol].request(options, (res) => {
                // console.log(`STATUS: ${res.statusCode}`);
                // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
                res.setEncoding('utf8');
                res.on('data', (chunk) => {
                    // console.log(`BODY: ${chunk}`);
                    return resolve(chunk);
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
            if (data) req.write(messageData,'utf8');
            req.end();


            function handleFormData() {
                messageData = querystring.stringify(data);
                options.headers['Content-Length'] =  messageData.length;
            }

        });

    }
}