const q = 'tasks';
const open = require('amqplib').connect('amqp://localhost');


export default class QueueMessagesLayer {
    constructor() {}

    public async init() {
        console.log('INIT QML');


        //////////



        // Publisher
        open.then(function(conn) {
            return conn.createChannel();
        }).then(function(ch) {
            return ch.assertQueue(q).then(function(ok) {
                return ch.sendToQueue(q, new Buffer('something to do'));
            });
        }).catch(console.warn);

// Consumer
        open.then(function(conn) {
            return conn.createChannel();
        }).then(function(ch) {
            return ch.assertQueue(q).then(function(ok) {
                return ch.consume(q, function(msg) {
                    if (msg !== null) {
                        console.log(msg.content.toString());
                        ch.ack(msg);
                    }
                });
            });
        }).catch(console.warn);

    }
}