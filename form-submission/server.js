const express = require('express');
const net = require('net');
const winston = require('winston');
require('winston-papertrail').Papertrail;

const app = express();
const port = process.env.PORT || 3000;

// Configure Winston for logging to Papertrail
const logger = winston.createLogger({
    transports: [
        new winston.transports.Papertrail({
            host: process.env.PAPERTRAIL_HOST, // Use environment variable
            port: process.env.PAPERTRAIL_PORT, // Use environment variable
            logFormat: function (level, message) {
                return `${new Date().toISOString()} [${level}] ${message}`;
            },
            handleExceptions: true
        })
    ]
});

// Connectivity test endpoint
app.get('/test-connectivity', (req, res) => {
    const client = new net.Socket();
    const host = process.env.PAPERTRAIL_HOST;
    const port = process.env.PAPERTRAIL_PORT;

    client.setTimeout(5000); // 5 seconds timeout

    client.connect(port, host, () => {
        console.log(`Successfully connected to ${host}:${port}`);
        logger.info(`Successfully connected to ${host}:${port}`);
        res.send(`Successfully connected to ${host}:${port}`);
        client.destroy(); // Close the connection
    });

    client.on('error', (err) => {
        console.error(`Connection error: ${err.message}`);
        logger.error(`Connection error: ${err.message}`);
        res.status(500).send(`Connection error: ${err.message}`);
    });

    client.on('timeout', () => {
        console.error(`Connection timeout`);
        logger.error(`Connection timeout`);
        res.status(500).send(`Connection timeout`);
        client.destroy(); // Close the connection
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    logger.info(`Server running at http://localhost:${port}`);
});
