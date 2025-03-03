import express from "express";
import cors from "cors";
import morgan from "morgan";

import initializeRoutes from "./route.js";
import { sendError } from "./lib/api.response.js";
const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
initializeRoutes(app);
app.route("*").all((req, res) => {
  sendError(res, {
    statusCode: 404,
    message: "Route not found",
  });
});
export { app };
