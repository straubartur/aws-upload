const nodemailer = require('nodemailer');
require('dotenv').config()

/**
 * const mailOptions = {
    from: 'no-reply@diegopinho.com',
    to: 'destinatario@yahoo.com',
    subject: 'E-mail enviado usando Node!',
    text: 'Bem fácil, não? ;)'
  };
 */

const transporter = nodemailer.createTransport({
    host: "smtp-relay.sendinblue.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_AUTH,
        pass: process.env.EMAIL_KEY
    },
    tls: { rejectUnauthorized: false }
});


module.exports = transporter