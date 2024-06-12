const fs = require('fs');
const nodemailer = require('nodemailer');

async function sendEmail(recipientEmail, subject, text, attachment) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipientEmail,
    subject: subject,
    text: text,
    attachments: attachment ? [{ path: attachment.path, filename: attachment.originalname }] : []
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
        reject(Object.assign(new Error('Error sending email'), { responseCode: error.responseCode }));
      } else {
        console.log('Email sent: ' + info.response);
        if (attachment) {
          fs.unlink(attachment.path, (err) => {
            if (err) console.error('Error deleting uploaded file:', err);
          });
        }
        resolve('Email sent successfully');
      }
    });
  });
}

module.exports = { sendEmail };
    