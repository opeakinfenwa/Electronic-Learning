import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import logger from "../config/logger";

dotenv.config();

const getDatabaseUrl = () => {
  if (process.env.NODE_ENV === "production") {
    return process.env.DATABASE_URL_PROD || "";
  } else if (process.env.NODE_ENV === "test") {
    return process.env.DATABASE_URL_TEST || "";
  } else {
    return process.env.DATABASE_URL || "";
  }
};

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: getDatabaseUrl(),
    },
  },
});

const connectDB = async () => {
  try {
    await prisma.$connect();
    logger.info("Connected to the database");
  } catch (error) {
    logger.error(`Database connection failed: ${(error as Error).message}`);
    process.exit(1);
  }
};

const shutdown = async (signal: string) => {
  logger.warn(`Received ${signal}. Closing database connection...`);
  await prisma.$disconnect();
  logger.info("Database disconnected");
  process.exit(0);
};

["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, () => shutdown(signal));
});

export { prisma, connectDB };