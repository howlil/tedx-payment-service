const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
require('dotenv').config();

const { combine, timestamp, printf, colorize, json } = winston.format;

// Custom format untuk console output
const consoleFormat = printf(({ level, message, timestamp, requestId, ...metadata }) => {
    return `${timestamp} [${level}] ${requestId || 'NO_REQ_ID'}: ${message} ${
        Object.keys(metadata).length ? JSON.stringify(metadata, null, 2) : ''
    }`;
});

// Transport untuk file harian
const fileRotateTransport = new DailyRotateFile({
    filename: 'logs/app-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    format: combine(
        timestamp(),
        json()
    )
});

// Transport untuk error file
const errorFileRotateTransport = new DailyRotateFile({
    filename: 'logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    level: 'error',
    format: combine(
        timestamp(),
        json()
    )
});

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    defaultMeta: { service: 'ticket-service' },
    transports: [
        // Console transport dengan warna
        new winston.transports.Console({
            format: combine(
                colorize(),
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                consoleFormat
            )
        }),
        fileRotateTransport,
        errorFileRotateTransport
    ],
    // Penanganan exception dan rejection
    exceptionHandlers: [
        new DailyRotateFile({
            filename: 'logs/exceptions-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d',
            format: combine(
                timestamp(),
                json()
            )
        })
    ],
    rejectionHandlers: [
        new DailyRotateFile({
            filename: 'logs/rejections-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d',
            format: combine(
                timestamp(),
                json()
            )
        })
    ],
    exitOnError: false
});

module.exports = logger;