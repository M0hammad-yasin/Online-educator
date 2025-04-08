import express from "express";
import cors from "cors";
import morgan from "morgan";

import initializeRoutes from "./route.js";
import { sendError } from "./Lib/api.response.js";
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
app.route("*").all((req, res) => {
  sendError(res, {
    statusCode: 404,
    message: "Route not found",
  });
});
export { app };
