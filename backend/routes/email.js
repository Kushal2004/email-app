const express = require('express');
const path = require('path');
const { sendEmailWithAttachment } = require('../service/email_controller');
const upload = require('../middleware/multer'); // Use multer middleware

const router = express.Router();

router.post('/send', upload.single('attachment'), (req, res) => {
  const { recipientEmail, subject, text } = req.body;
  const attachment = req.file;

  if (!recipientEmail || !subject || !text) {
    return res.status(400).send('Recipient email, subject, and text are required');
  }

  sendEmailWithAttachment(recipientEmail, subject, text, attachment, res);
});

module.exports = router;
