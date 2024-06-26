const express = require('express');
const multer = require('multer');
const winston = require('winston');
require('winston-loggly-bulk');

const app = express();
const port = process.env.PORT || 3000;

// Configure multer for file upload handling
const upload = multer();

// Determine log level and destination
const logLevel = process.env.LOG_LEVEL || 'info';
const logDestination = process.env.LOG_DESTINATION || 'console';

// Configure Winston
const transports = [];
if (logDestination === 'loggly') {
    transports.push(new winston.transports.Loggly({
        token: process.env.LOGGLY_TOKEN,
        subdomain: process.env.LOGGLY_SUBDOMAIN,
        tags: ["Winston-NodeJS"],
        json: true,
        level: logLevel
    }));
} else {
    transports.push(new winston.transports.Console({
        format: winston.format.simple(),
        level: logLevel
    }));
}

const logger = winston.createLogger({
    transports: transports
});

// Middleware to log requests
app.use((req, res, next) => {
    logger.log('info', `HTTP ${req.method} ${req.url}`);
    next();
});

// Endpoint to handle form submission
app.post('/api/submit', upload.none(), (req, res) => {
    const formData = req.body;
    logger.log('info', 'Form Data:', formData);
    res.sendStatus(200);
});

app.listen(port, () => {
    logger.log('info', `Server running at http://localhost:${port}`);
});
