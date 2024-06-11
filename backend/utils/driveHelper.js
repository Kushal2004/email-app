const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const { sendEmail } = require('./mailHelper'); // Import sendEmail function

async function uploadFile(auth, filePath, recipientEmail, subject, text, res) {
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

module.exports = { uploadFile };
