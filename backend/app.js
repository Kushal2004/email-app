const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsMiddleware = require('./middleware/cors');
const bodyParserMiddleware = require('./middleware/bodyParser');

// Apply middleware
app.use(corsMiddleware);
app.use(bodyParserMiddleware);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const emailRoutes = require('./routes/email');
app.use('/api/email', emailRoutes);

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
