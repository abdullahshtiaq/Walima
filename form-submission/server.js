const express = require('express');
const multer = require('multer');
const winston = require('winston');
require('winston-papertrail').Papertrail;

const app = express();
const port = process.env.PORT || 3000;

// Configure multer for file upload handling
const upload = multer();

// Configure Winston for logging to Papertrail
const logger = winston.createLogger({
    transports: [
        new winston.transports.Papertrail({
            host: process.env.PAPERTRAIL_HOST, // Use environment variable
            port: process.env.PAPERTRAIL_PORT, // Use environment variable
            logFormat: function (level, message) {
                return `${new Date().toISOString()} [${level}] ${message}`;
            }
        })
    ]
});

// Middleware to log requests
app.use((req, res, next) => {
    console.log(`HTTP ${req.method} ${req.url}`); // Console log
    logger.info(`HTTP ${req.method} ${req.url}`);
    next();
});

// Endpoint to handle form submission
app.post('/api/submit', upload.none(), (req, res) => {
    const formData = req.body;
    console.log('Form Data:', formData); // Console log
    logger.info(`Form Data: ${JSON.stringify(formData)}`);
    res.sendStatus(200);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(`Error: ${err.message}`); // Console log
    logger.error(`Error: ${err.message}`);
    res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`); // Console log
    logger.info(`Server running at http://localhost:${port}`);
});
