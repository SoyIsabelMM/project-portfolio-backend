const { Sender, Recipient, EmailParams, MailerSend } = require('mailersend');
const { emailApiKey } = require('./get-env-vars');

const mailerSend = new MailerSend({
  apiKey: emailApiKey,
});

const sendEmail = async ({ recipientEmail, recipientName, htmlMessage }) => {
  try {
    const sentFrom = new Sender(
      'no-reply@trial-z86org8o5014ew13.mlsender.net',
      'Portfolios'
    );
    const recipients = [new Recipient(recipientEmail, recipientName)];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject('Contacto - Portfolios')
      .setHtml(htmlMessage);

    await mailerSend.email.send(emailParams);
  } catch (error) {
    console.log('Error sending email', error.message, error);
    throw new Error('Error sending email');
  }
};

module.exports = { sendEmail };
