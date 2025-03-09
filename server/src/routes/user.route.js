// routes/userRoutes.ts
import express from "express";
import {
  createUser,
  getUser,
  loginUser,
} from "../controllers/UserController/user.controller.js";
import { hasRole } from "../middleware/roleCheck.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { userSchema } from "../validation/user.validate.js";
import { mongoIdSchema } from "../validation/mongoId.validate.js";
import { loginSchema } from "../validation/login.validate.js";

import auth from "../middleware/auth.js";
const router = express.Router();

router.post("/register", validateBody(userSchema), createUser);
router.post("/login", validateBody(loginSchema), loginUser);
router.get("/me", auth, getUser);
router.get(
  "/:id",
  validateBody(mongoIdSchema),
  auth,
  hasRole(["ADMIN", "MODERATOR"]),
  getUser
);

export default router;
