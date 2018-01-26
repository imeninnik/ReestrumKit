const amqp = require('amqplib/callback_api');


export default class RabbitMQ {
    private connection;

    constructor() {}

    public async init() {
        return new Promise((resolve, reject) => {
            amqp.connect('amqp://localhost', (err, conn) => {
                if (err) {
                    console.log(err);
                    reject(err);

                    return err;
                }
                this.connection = conn;

                process.once('SIGINT', this.connection.close.bind(conn));

                return resolve();
            });

        });
    }

    public tst() {

        /// CLOSE CONNECTION OR NOT? conn.close();

        this.connection.createChannel(function(err, ch) {
            const q = 'hello';
            ch.prefetch(1);
            ch.assertQueue(q, {durable: false});


            ch.consume(q, function(msg) {
                const secs = msg.content.toString().split('.').length - 1;

                console.log(" [v1] Received %s", msg.content.toString());
                setTimeout(() => {
                    console.log(" [V1] Done");
                    ch.ack(msg);

                }, secs * 1000);

            }, {noAck: false});

        });
        this.connection.createChannel(function(err, ch) {
            const q = 'hello';
            ch.prefetch(1);
            ch.assertQueue(q, {durable: false});


            ch.consume(q, function(msg) {
                const secs = msg.content.toString().split('.').length - 1;

                console.log(" [v2] Received %s", msg.content.toString());
                setTimeout(() => {
                    console.log(" [V2] Done");
                    ch.ack(msg);

                }, secs * 1000);

            }, {noAck: false});

        });



        this.connection.createChannel(function(err, ch) {
            const q = 'hello';

            ch.assertQueue(q, {durable: false});


            const message = new Buffer('Hello World!..... ' + new Date() );

           ch.sendToQueue(q, message );
           console.log(" [SENT] >>\t", message.toString() );

        });
    }

    public close() {
        return this.connection.close();
    }
}