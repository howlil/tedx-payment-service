const express = require('express');
const router = express.Router();
const { listTickets } = require('../controllers/ticket.controller');
const { createNewOrder, handlePaymentWebhook } = require('../controllers/payment.controller');


router.get('/api/tickets', listTickets);
router.post('/api/orders', createNewOrder);
router.post('/api/payment-callback', handlePaymentWebhook);

module.exports = router;
