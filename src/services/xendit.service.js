// src/services/xendit.service.js
const InvoiceController = require('../controllers/xenditInvoice.controller');
const invoiceController = new InvoiceController();

const createXenditInvoice = async (orderData, order, ticketsData) => {
    const { full_name, email, no_hp, tickets } = orderData;

    const invoiceData = {
        external_id: order.id,
        amount: order.totalAmount,
        payer_email: email,
        description: `Ticket Order - ${full_name}`,
        invoice_duration: 86400,
        currency: "IDR",
        payment_methods: [
            "CREDIT_CARD", "BCA", "BNI", "BRI", 
            "MANDIRI", "BSI", "PERMATA", 
            "ALFAMART", "INDOMARET"
        ],
        merchant_name: "TEDx Event",
        locale: "id",
        payer: {
            email,
            full_name,
            phone_number: no_hp
        },
        items: tickets.map(item => {
            const ticket = ticketsData.find(t => t.id === item.ticketId);
            return {
                name: `Ticket ${ticket.type}`,
                quantity: item.quantity,
                price: ticket.price,
                category: "Ticket",
                url: "https://your-website.com/tickets"
            };
        }),
        should_send_email: true,
        success_redirect_url: process.env.SUCCESS_REDIRECT_URL,
        failure_redirect_url: process.env.FAILURE_REDIRECT_URL,
        platform_callback_url: process.env.CALLBACK_URL
    };

    try {
        const invoice = await invoiceController.create(invoiceData);
        return invoice;
    } catch (error) {
        console.error('❌ Xendit invoice creation failed:', error.response?.data || error);
        throw new Error(`Failed to create Xendit invoice: ${error.response?.data?.message || error.message}`);
    }
};

module.exports = {
    createXenditInvoice
};