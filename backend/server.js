import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import prisma from "./src/config/prisma.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await prisma.$connect();

    const server = app.listen(PORT, () => {
      console.log(`Cartly API running at http://localhost:${PORT}`);
    });

    async function shutdown() {
      server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
      });
    }

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("Failed to start Cartly:", error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();