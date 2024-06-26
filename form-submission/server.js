const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    logMessage('MongoDB connected', 'info');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    logMessage(`MongoDB connection error: ${err.message}`, 'error');
  });

// Define a schema and model for form data
const formDataSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  attending: String,
  guests: Number
}, { timestamps: true });

const FormData = mongoose.model('FormData', formDataSchema);

// Define a schema and model for logs
const logSchema = new mongoose.Schema({
  message: String,
  level: String,
  timestamp: Date
}, { timestamps: true });

const Log = mongoose.model('Log', logSchema);

// Configure multer for file upload handling
const upload = multer();

app.use(express.static('public'));

// Log function to save logs to MongoDB and file
function logMessage(message, level = 'info') {
  const logEntry = new Log({ message, level, timestamp: new Date() });
  logEntry.save().catch(err => console.error('Error saving log:', err));
  fs.appendFile('logs.txt', `[${new Date().toISOString()}] [${level}] ${message}\n`, err => {
    if (err) console.error('Error writing to log file:', err);
  });
}

// Endpoint to handle form submission
app.post('/api/submit', upload.none(), async (req, res) => {
  try {
    logMessage(`Form Data received: ${JSON.stringify(req.body)}`, 'info');
    const formData = new FormData(req.body);
    await formData.save();
    logMessage(`Form Data saved: ${JSON.stringify(formData)}`, 'info');
    res.sendStatus(200);
  } catch (error) {
    logMessage(`Error saving form data: ${error.message}`, 'error');
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  logMessage(`Server running at http://localhost:${port}`, 'info');
  console.log(`Server running at http://localhost:${port}`);
});
