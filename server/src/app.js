import express from "express";
import cors from "cors";
import morgan from "morgan";
import config from "./config/config.js";
import prisma from "./utils/prisma.client.js";
import userRoutes from "./routes/user.route.js";

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
app.use("/api/user", userRoutes);
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
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  prisma.$connect().then(() => {
    console.log("Connected to database");
  });
});
export { app };
