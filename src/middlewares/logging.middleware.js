// src/middleware/logging.middleware.js
const logger = require('../configs/logger');

const generateRequestId = () => {
    return `req-${Date.now()}-${Math.random().toString(36).substring(7)}`;
};

const maskSensitiveData = (body) => {
    if (!body) return body;
    const maskedBody = { ...body };
    
    // Masking sensitive fields
    const sensitiveFields = ['password', 'token', 'credit_card', 'card_number'];
    sensitiveFields.forEach(field => {
        if (maskedBody[field]) {
            maskedBody[field] = '***MASKED***';
        }
    });
    
    return maskedBody;
};

const loggingMiddleware = (req, res, next) => {
    // Generate unique request ID
    const requestId = generateRequestId();
    req.requestId = requestId;

    // Get request start time
    const startTime = Date.now();

    // Log request
    logger.info('Incoming request', {
        requestId,
        method: req.method,
        url: req.originalUrl,
        query: req.query,
        body: maskSensitiveData(req.body),
        ip: req.ip,
        userAgent: req.get('user-agent')
    });

    // Override response methods to log
    const originalSend = res.send;
    res.send = function(data) {
        const responseTime = Date.now() - startTime;
        
        // Log response
        logger.info('Outgoing response', {
            requestId,
            statusCode: res.statusCode,
            responseTime: `${responseTime}ms`,
            body: maskSensitiveData(JSON.parse(data))
        });

        // Add response time header
        res.set('X-Response-Time', `${responseTime}ms`);
        
        originalSend.apply(res, arguments);
    };

    next();
};

// Error logging middleware
const errorLoggingMiddleware = (err, req, res, next) => {
    logger.error('Request error', {
        requestId: req.requestId,
        error: err.message,
        stack: err.stack,
        method: req.method,
        url: req.originalUrl,
        body: maskSensitiveData(req.body)
    });

    next(err);
};

module.exports = {
    loggingMiddleware,
    errorLoggingMiddleware
};