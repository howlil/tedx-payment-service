const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const app = express();
const router = require('./src/routes/routes.js') 
const { loggingMiddleware, errorLoggingMiddleware } = require('./src/middlewares/logging.middleware.js');

const corsOptions = {
    origin: "*", // Remove trailing slash
};


app.use(logger('dev'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(loggingMiddleware);
app.use(router)



// Error handling middlewares
app.use(errorLoggingMiddleware);

// Final error handler
app.use((err, req, res, next) => {
    res.status(500).json({
        error: err.message,
        requestId: req.requestId
    });
});



// Uncaught exception handler
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', {
        error: error.message,
        stack: error.stack
    });
    process.exit(1);
});

// Unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection', {
        reason,
        promise
    });
})

module.exports = app;
