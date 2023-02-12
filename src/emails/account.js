const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeMail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'aryanjasra01@gmail.com',
        subject: 'Welcome mail',
        text: `Hi ${name} ! Thanks for joining in . Let us know how you get along .`
    })
}

const sendCancelationMail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'aryanjasra01@gmail.com',
        subject: 'Cancelation mail',
        text: `Thankyou ${name} for your time. I hope we could do something to keep you onborad.`
    })
}

module.exports = {
    sendWelcomeMail,
    sendCancelationMail
}