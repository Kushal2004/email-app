const express = require('express');
const fs = require('fs');
const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importing cors

const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const CREDENTIALS_PATH = 'credentials.json';
const TOKEN_PATH = 'token.json';
const upload = multer({ dest: 'uploads/' });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors()); // Using cors middleware


let oAuth2Client;
fs.readFile(CREDENTIALS_PATH, (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  authorize(JSON.parse(content));
});

function authorize(credentials) {
  const { client_secret, client_id, redirect_uris } = credentials.web;
  oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client);
    oAuth2Client.setCredentials(JSON.parse(token));
  });
}

function getAccessToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({ access_type: 'offline', scope: SCOPES });
  console.log('Authorize this app by visiting this url:', authUrl);
  const server = http.createServer((req, res) => {
    if (req.url.startsWith('/oauth2callback')) {
      const query = url.parse(req.url, true).query;
      const code = query.code;
      oAuth2Client.getToken(code, (err, token) => {
        if (err) {
          console.error('Error retrieving access token', err);
          res.end('Error retrieving access token');
          return;
        }
        oAuth2Client.setCredentials(token);
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        res.end('Authorization successful! You can close this tab.');
        server.close();
      });
    }
  }).listen(3000, () => console.log('Server is listening on port 3000'));
}

app.post('/send-email', upload.single('attachment'), (req, res) => {
  const { recipientEmail, subject, text } = req.body;
  const attachment = req.file;

  if (!recipientEmail || !subject || !text) {
    return res.status(400).send('Recipient email, subject, and text are required');
  }

  if (attachment && path.extname(attachment.originalname) === '.zip') {
    uploadFile(oAuth2Client, attachment.path, recipientEmail, subject, text, res);
  } else {
    sendEmail(recipientEmail, subject, text, attachment, res);
  }
});

function uploadFile(auth, filePath, recipientEmail, subject, text, res) {
  const drive = google.drive({ version: 'v3', auth });
  const fileMetadata = { 'name': path.basename(filePath) };
  const media = { mimeType: 'application/zip', body: fs.createReadStream(filePath) };

  drive.files.create({ resource: fileMetadata, media: media, fields: 'id' }, (err, file) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error uploading file to Google Drive');
    } else {
      const fileId = file.data.id;
      const fileLink = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
      sendEmail(recipientEmail, subject, `${text}\n\nYour file has been uploaded to Google Drive: ${fileLink}`, null, res);
    }
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting uploaded file:', err);
    });
  });
}

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

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
