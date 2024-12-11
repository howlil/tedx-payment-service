const { getAvailableTickets } = require('../services/ticket.service');

const listTickets = async (req, res) => {
    try {
        const tickets = await getAvailableTickets();
        res.status(200).json({
            message: "succesfull get data",
            data: tickets
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    listTickets
};