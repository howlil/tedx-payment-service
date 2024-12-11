const { Xendit,Invoice } = require('xendit-node');
require('dotenv').config();

const xenditClient = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY,
  xenditURL: process.env.XENDIT_ENVIRONMENT === 'PRODUCTION'
    ? 'https://api.xendit.co'
    : 'https://api.sandbox.xendit.co'
});

module.exports = xenditClient;