// routes/userRoutes.ts
import express from "express";
import {
  createUser,
  getAllUsers,
  getUser,
} from "../controllers/user.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { userSchema } from "../utils/validate.js";
const router = express.Router();

router.post("/register", validate(userSchema), createUser);

export default router;
