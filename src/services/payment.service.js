// src/services/payment.service.js
const prisma = require('../configs/config.js');
const { validateTicketAvailability, calculateTotalAmount } = require('../utils/ticket.utils.js');
const { createXenditInvoice } = require('./xendit.service');
const logger = require('../configs/logger');

// Fungsi untuk mengurangi stok tiket berdasarkan orderId
const updateTicketStock = async (prisma, orderId) => {
  logger.info(`📦 Updating ticket stock for order: ${orderId}`);

  // Ambil data order termasuk item di dalamnya
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true }
  });

  logger.info('Updating stock for items:', order.items);

  // Kurangi stok berdasarkan jumlah tiket yang dipesan
  const updatePromises = order.items.map(item =>
    prisma.ticket.update({
      where: { id: item.ticketId },
      data: {
        amount: {
          decrement: item.quantity // Mengurangi stok tiket
        }
      }
    })
  );

  await Promise.all(updatePromises); // Tunggu semua stok selesai diperbarui
  logger.info('✅ Stock updated successfully');
};

// Fungsi untuk membuat order baru
const createOrder = async (orderData) => {
  logger.info('🚀 Starting order creation process...');
  const { full_name, email, no_hp, tickets } = orderData;

  return await prisma.$transaction(async (prisma) => {
    // Ambil ID tiket yang dipesan
    const ticketIds = tickets.map(t => t.ticketId);

    // Ambil data tiket berdasarkan ID yang dipesan
    const ticketsData = await prisma.ticket.findMany({
      where: { id: { in: ticketIds } }
    });

    // Validasi apakah semua tiket tersedia
    if (ticketsData.length !== ticketIds.length) {
      const foundIds = ticketsData.map(t => t.id);
      const missingIds = ticketIds.filter(id => !foundIds.includes(id));
      throw new Error(`Tickets not found: ${missingIds.join(', ')}`);
    }

    // Validasi ketersediaan tiket
    await validateTicketAvailability(tickets, ticketsData);

    // Hitung total harga tiket
    const totalAmount = calculateTotalAmount(tickets, ticketsData);

    // Buat data user baru

    let user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      user = await prisma.user.create({
        data: { full_name, email, no_hp }
      });
    } else {
      logger.info(`User found: ${user.id}, reusing existing user`);
    }

    // Buat order baru di database
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount,
        items: {
          create: tickets.map(item => ({
            ticketId: item.ticketId,
            quantity: item.quantity,
            price: ticketsData.find(t => t.id === item.ticketId).price
          }))
        }
      },
      include: {
        items: true,
        user: true
      }
    });

    // Buat invoice melalui API Xendit
    const invoice = await createXenditInvoice(orderData, order, ticketsData);

    // Simpan data pembayaran ke database
    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: totalAmount,
        xenditInvoiceId: invoice.id,
        xenditInvoiceUrl: invoice.invoice_url
      }
    });

    return { order, payment, paymentUrl: invoice.invoice_url }; // Return data order dan URL pembayaran
  });
};

// Fungsi untuk menangani callback pembayaran dari Xendit
const handlePaymentCallback = async (callbackData) => {
  logger.info('Received payment callback:', callbackData);
  const { external_id, status, payment_method, paid_at } = callbackData;

  return await prisma.$transaction(async (prisma) => {
    // Perbarui status pembayaran
    const payment = await prisma.payment.update({
      where: {
        orderId: external_id // external_id adalah ID order kita
      },
      data: {
        status: status === 'PAID' ? 'PAID' : 'FAILED',
        paymentMethod: payment_method,
        paidAt: paid_at ? new Date(paid_at) : null
      }
    });

    // Jika pembayaran sukses, perbarui status order dan kurangi stok tiket
    if (status === 'PAID') {
      await prisma.order.update({
        where: { id: external_id },
        data: { status: 'PAID' }
      });
      await updateTicketStock(prisma, external_id);
    }

    return payment;
  });
};

module.exports = {
  createOrder,
  handlePaymentCallback
};
