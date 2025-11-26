import express from "express";
import cors from "cors";
import morgan from "morgan";

import initializeRoutes from "./route.js";
import { NotFoundError } from "./utils/index.js";
import config from "./config/config.js";
const app = express();

// Middleware
app.use(
  cors({
    origin: config.isProduction
      ? "yourdomain.com"
      : `http://localhost:${config.clientPort}`,
    credentials: true,
  })
);
app.use(morgan("dev"));
initializeRoutes(app);
app.route("*").all((req, res, next) => {
  throw new NotFoundError("Route not found");
});
export { app };
