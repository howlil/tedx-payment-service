const axios = require('axios');
require('dotenv').config();

class InvoiceController {
    constructor() {
        this.url = 'https://api.xendit.co/v2/invoices';  
        this.headers = {
            'Content-Type': 'application/json'
        };
        this.auth = {
            username: process.env.XENDIT_SECRET_KEY,  
            password: ''
        };
        this.timeout = 10000;
    }

    async create(data) {
        console.log('Creating Xendit invoice with data:', JSON.stringify(data, null, 2));
        
        const options = {
            method: 'POST',
            headers: this.headers,
            timeout: this.timeout,
            auth: this.auth,
            url: this.url,
            data
        };

        try {
            const response = await axios(options);
            console.log('Xendit invoice created successfully:', response.data);
            return response.data;
        } catch (e) {
            console.error('Failed to create Xendit invoice:', e.response?.data || e.message);
            throw e;
        }
    }
}

module.exports = InvoiceController;