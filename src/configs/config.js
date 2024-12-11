const { PrismaClient } = require("@prisma/client");

require('dotenv').config();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  errorFormat: "pretty",
  log: ["query", "info", "warn", "error"],
});

async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log("Koneksi database berhasil.");
  } catch (error) {
    console.error("Koneksi database tidak berhasil: ", error);
  } finally {
    await prisma.$disconnect();
  }
}

if (process.env.NODE_ENV !== "production") {
  checkDatabaseConnection();
}




module.exports = prisma;