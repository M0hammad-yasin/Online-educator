// routes/userRoutes.ts
import express from "express";
import {
  createUser,
  getUser,
  loginUser,
} from "../controllers/user.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { userSchema, loginSchema, emailSchema } from "../utils/validate.js";
import auth from "../middleware/auth.js";
const router = express.Router();

router.post("/register", validate(userSchema), createUser);
router.post("/login", validate(loginSchema), loginUser);
router.get("/me", auth, getUser);

export default router;
