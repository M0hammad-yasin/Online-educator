import express from "express";
import cors from "cors";
import morgan from "morgan";
import config from "./config/config.js";
import prisma from "./Prisma/prisma.client.js";
import initializeRoutes from "./route.js";
const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initializeRoutes(app);

const PORT = config.port || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  prisma.$connect().then(() => {
    console.log("Connected to database");
  });
});
export { app };
