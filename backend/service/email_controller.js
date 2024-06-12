const path = require('path');
const fs = require('fs');
const { google } = require('googleapis');
const http = require('http');
const { uploadFile } = require('../utils/driveHelper');
const { sendEmail } = require('../utils/mailHelper');

const CREDENTIALS_PATH = path.join(__dirname, '..', 'credentials.json');
const TOKEN_PATH = path.join(__dirname, '..', 'token.json');
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

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
      const query = new URL(req.url, 'http://localhost:3000').searchParams;
      const code = query.get('code');
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

async function sendEmailWithAttachment(recipientEmail, subject, text, attachment, res) {
  try {
    await sendEmail(recipientEmail, subject, text, attachment);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    if (error.responseCode === 552) {
      // Handle blocked attachment by uploading to Google Drive
      console.error('Attachment blocked, uploading to Google Drive');
      await uploadFile(oAuth2Client, attachment.path, recipientEmail, subject, text, res);
    } else {
      console.error('Error sending email with attachment:', error);
      res.status(500).send('Failed to send email.');
    }
  }
}

module.exports = {
  sendEmailWithAttachment,
};
