process.env.TEMPLATE_DIRECTORY=`${__dirname}/templates`;
process.env.SENDER_EMAIL_ADDRESS='your.aws.verified.email.address@gmail.com';
process.env.AWS_REGION='eu-west-1';
process.env.AWS_ACCESS_KEY_ID='AKIAJNCBE7E4JNJP4ACA';
process.env.AWS_SECRET_ACCESS_KEY='u53xNMov5QMYiD311fv6/bL2fr/4pTEXoJA9ZWfY';

const sendemail  = require('sendemail'); // no api key




export default class Email {
    email: any;

    constructor() {
        this.email = sendemail.email;
    }

    public async sendSimple(from, to, subject, body) {
        const person = {
            senderEmailAddress: '"Some one" <lool@reestrum.com>',
            name : "Pavel",
            email: "p.karlovich+reestrum_test@gmail.com", // person.email can also accept an array of emails
            subject:"Welcome to DWYL :)",
            pass: '#$REW$F$C'
        };

        this.email('hello', person, (error, result) => {
            console.log(' - - - - - - - - - - - - - - - - - - - - -> email sent: ');
            console.log(result);
            console.log(' - - - - - - - - - - - - - - - - - - - - - - - - - - - -')
        })
    }
}