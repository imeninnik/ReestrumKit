import RabbitMQ from './RabbitMQ.class'


export default class QueueAccessLayer {
    private broker;

    constructor(private rkInstance) {}

    public async init() {

        this.broker = new RabbitMQ();
        return this.broker.init().catch(e => {
            console.error('Error Connecting to RabbitMQ', e);
            throw e;
        });
    }

    public tst() {
        return this.broker.tst();
    }

    public async subscribe(topicName, messageHandler) {

    }

    public async publish(topicName, messageData) {

    }

}