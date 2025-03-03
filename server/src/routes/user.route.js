// routes/userRoutes.ts
import express from "express";
import {
  createUser,
  getUser,
  loginUser,
} from "../controllers/UserController/user.controller.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { userSchema, loginSchema, emailSchema } from "../utils/validate.js";
import auth from "../middleware/auth.js";
const router = express.Router();

router.post("/register", validateBody(userSchema), createUser);
router.post("/login", validateBody(loginSchema), loginUser);
router.get("/me", auth, getUser);

export default router;
