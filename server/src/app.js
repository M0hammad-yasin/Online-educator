import express from "express";
import cors from "cors";
import morgan from "morgan";

import initializeRoutes from "./route.js";
import { NotFoundError } from "./Lib/custom.error.js";
import config from "./Config/config.js";
const app = express();

// Middleware
app.use(
  cors({
    origin: config.isProduction
      ? "yourdomain.com"
      : `http://localhost${config.port}`,
    credentials: true,
  })
);
app.use(morgan("dev"));
initializeRoutes(app);
app.route("*").all((req, res, next) => {
  throw new NotFoundError("Route not found");
});
export { app };
