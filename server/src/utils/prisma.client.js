import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client
const prisma = new PrismaClient();

// Optional: Add shutdown hook
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit();
});

export default prisma;
