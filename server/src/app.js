import express from "express";
import cors from "cors";
import morgan from "morgan";

import initializeRoutes from "./route.js";
const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
initializeRoutes(app);
export { app };
