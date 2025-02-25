import express from "express";
import cors from "cors";
import morgan from "morgan";
import { PrismaClient } from "@prisma/client";
import config from "./config/config.js";
const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Online-educator API" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});
const PORT = config.port || 5000;
// Start server
const prisma = new PrismaClient();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  prisma.$connect().then(() => {
    console.log("Connected to database");
  });
});
export { app };
