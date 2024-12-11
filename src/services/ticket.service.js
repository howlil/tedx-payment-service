const prisma = require('../configs/config.js')

const getAvailableTickets = async () => {
    return await prisma.ticket.findMany();
  };

const getTicketById = async (id) => {
    return await prisma.ticket.findUnique({
        where: { id }
    });
};
module.exports = {
    getAvailableTickets,
    getTicketById
  };
  