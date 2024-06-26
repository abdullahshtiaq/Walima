const express = require('express');
const multer = require('multer');
const winston = require('winston');
require('winston-papertrail').Papertrail;

const app = express();
const port = process.env.PORT || 3001;

// Configure multer for file upload handling
const upload = multer();

// Configure Winston for logging to Papertrail
const logger = winston.createLogger({
    transports: [
        new winston.transports.Papertrail({
            host: 'logs.papertrailapp.com', // Replace with your Papertrail log destination host
            port: 33101, // Replace with your Papertrail log destination port
            logFormat: function (level, message) {
                return `[${level}] ${message}`;
            }
        })
    ]
});

// Middleware to log requests
app.use((req, res, next) => {
    logger.info(`HTTP ${req.method} ${req.url}`);
    next();
});

// Endpoint to handle form submission
app.post('/api/submit', upload.none(), (req, res) => {
    const formData = req.body;
    logger.info('Form Data:', formData);
    res.sendStatus(200);
});

app.listen(port, () => {
    logger.info(`Server running at http://localhost:${port}`);
});
