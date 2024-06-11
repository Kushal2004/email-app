const fs = require('fs');
const nodemailer = require('nodemailer');

function sendEmail(recipientEmail, subject, text, attachment, res) {
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

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      res.send('Email sent successfully');
      if (attachment) {
        fs.unlink(attachment.path, (err) => {
          if (err) console.error('Error deleting uploaded file:', err);
        });
      }
    }
  });
}

module.exports = { sendEmail };
