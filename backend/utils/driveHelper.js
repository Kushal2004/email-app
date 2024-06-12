const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const { sendEmail } = require('./mailHelper'); // Import sendEmail function

async function uploadFile(auth, filePath, recipientEmail, subject, text, res) {
  const drive = google.drive({ version: 'v3', auth });
  const fileMetadata = { 'name': path.basename(filePath) };
  const media = { mimeType: 'application/zip', body: fs.createReadStream(filePath) };

  drive.files.create({ resource: fileMetadata, media: media, fields: 'id' }, async (err, file) => {
    if (err) {
      console.error('Error uploading file to Google Drive:', err);
      res.status(500).send('Error uploading file to Google Drive');
    } else {
      const fileId = file.data.id;
      const fileLink = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
      try {
        await sendEmail(recipientEmail, subject, `${text}\n\nYour file has been uploaded to Google Drive: ${fileLink}`);
        res.send('Email sent successfully with Google Drive link');
      } catch (emailError) {
        console.error('Error sending email with Google Drive link:', emailError);
        res.status(500).send('Failed to send email with Google Drive link.');
      }
    }
    fs.unlink(filePath, (unlinkErr) => {
      if (unlinkErr) console.error('Error deleting uploaded file:', unlinkErr);
    });
  });
}

module.exports = { uploadFile };
