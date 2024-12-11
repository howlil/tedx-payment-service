const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const tickets = [
    {
        type: 'Pre-Sale',
        price: 79440,
        amount: 25,
        description: 'Pre-Sale Ticket (25 Ticket) tersedia 5-8 Des',
        validFrom: new Date('2024-12-05T00:01:00.000Z'), // Mulai 00:01
        validUntil: new Date('2024-12-08T23:59:00.000Z') // Sampai 23:59
    },
    {
        type: 'Normal',
        price: 84405,
        amount: 25,
        description: 'Normal Ticket (25 Ticket) tersedia 9-13 Des',
        validFrom: new Date('2024-12-09T00:01:00.000Z'),
        validUntil: new Date('2024-12-13T23:59:00.000Z')
    },
    {
        type: 'Bundle Duo',
        price: 148950,
        amount: 20,
        description: '1 Bundle untuk 2 Orang, tersedia 9-11 Des',
        validFrom: new Date('2024-12-09T00:01:00.000Z'),
        validUntil: new Date('2024-12-11T23:59:00.000Z')
    },
    {
        type: 'Bundle Group',
        price: 372375,
        amount: 2,
        description: '1 Grup terdiri dari 5 Orang, tersedia 9-11 Des',
        validFrom: new Date('2024-12-09T00:01:00.000Z'),
        validUntil: new Date('2024-12-11T23:59:00.000Z')
    }
];

async function main() {
    console.log('Start seeding tickets...');

    for (const ticket of tickets) {
        const createdTicket = await prisma.ticket.create({
            data: ticket
        });
        console.log(`Created ticket with id: ${createdTicket.id}`);
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });