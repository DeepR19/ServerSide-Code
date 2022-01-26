const htmlToText  = require('html-to-text');
const nodemailer = require('nodemailer');
const pug = require('pug');


module.exports = class Email{

    constructor(user, url){
        this.to = user.email;
        this.firstname = user.name;
        this.url = url;
        this.from = 'Deepak <admin@gmail.com>'
    }

    newTransport(){
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }
    
    async send(template, subject){
        const html=  pug.renderFile(`${__dirname}/../views/${template}.pug`,{
            firstname: this.firstname, // passing this attib to the template
            url: this.url,
            subject
        });

        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.fromString(html)
        }
        
        await this.newTransport().sendMail(mailOptions);

    }
    async sendWelcome(){
        console.log(__dirname)
        await this.send("welcome", "Welcome to The Udemy Course of the MongoDB!!")
    }
    async sendPassResetMail(){
        await this.send("reset", "Reset mail from MailTrap--Udemy");
    }
}


