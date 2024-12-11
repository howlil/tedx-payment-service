// src/utils/ticketUtils.js
const validateTicketAvailability = async (tickets, ticketsData) => {
    console.log('🔍 Validating ticket availability...');
    const now = new Date();
    
    for (const ticket of ticketsData) {
        console.log(`Checking ticket: ${ticket.type}`);
        console.log(`- Valid period: ${ticket.validFrom} to ${ticket.validUntil}`);
        console.log(`- Current time: ${now}`);
        console.log(`- Available amount: ${ticket.amount}`);

        if (ticket.validFrom >= now || ticket.validUntil <= now) {
            console.error(`❌ Ticket ${ticket.type} is not in valid period`);
            throw new Error(`Ticket ${ticket.type} is not available at this time`);
        }

        const orderTicket = tickets.find(t => t.ticketId === ticket.id);
        console.log(`- Requested quantity: ${orderTicket.quantity}`);

        if (orderTicket.quantity > ticket.amount) {
            console.error(`❌ Insufficient stock for ${ticket.type}. Requested: ${orderTicket.quantity}, Available: ${ticket.amount}`);
            throw new Error(`Insufficient stock for ticket ${ticket.type}`);
        }
    }
    console.log('✅ All tickets validated successfully');
};

const calculateTotalAmount = (tickets, ticketsData) => {
    console.log('💰 Calculating total amount...');
    const total = tickets.reduce((total, item) => {
        const ticket = ticketsData.find(t => t.id === item.ticketId);
        
        if (!ticket) {
            console.error(`❌ Ticket with id ${item.ticketId} not found`);
            throw new Error(`Ticket with id ${item.ticketId} not found`);
        }

        const itemTotal = ticket.price * item.quantity;
        console.log(`- ${ticket.type}: ${item.quantity} x ${ticket.price} = ${itemTotal}`);
        return total + itemTotal;
    }, 0);
    
    console.log(`Total amount: ${total}`);
    return total;
};

module.exports = {
    validateTicketAvailability,
    calculateTotalAmount
};