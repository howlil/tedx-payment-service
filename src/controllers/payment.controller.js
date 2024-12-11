const { createOrder, handlePaymentCallback } = require('../services/payment.service');

const createNewOrder = async (req, res) => {
    try {
        const result = await createOrder(req.body);
        res.status(201).json({
            message: "succesfull create order",
            data: result
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const handlePaymentWebhook = async (req, res) => {
    try {
        const result = await handlePaymentCallback(req.body);
        res.status(200).json({
            message: "succesfull handle Payment",
            data: result
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createNewOrder,
    handlePaymentWebhook
};
