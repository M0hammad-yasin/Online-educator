// routes/userRoutes.ts
import express from "express";
import {
  createUser,
  getUser,
  loginUser,
} from "../Controllers/UserController/user.controller.js";
import { hasRole } from "../middleware/roleCheck.js";
import { validate, validateBody } from "../Middleware/validate.middleware.js";
import { userSchema } from "../Validation/user.validate.js";
import { mongoIdSchema } from "../Validation/mongoId.validate.js";
import { loginSchema } from "../Validation/login.validate.js";

import auth from "../Middleware/auth.js";
const router = express.Router();

router.post("/register", validateBody(userSchema), createUser);
router.post(
  "/login",
  validate(loginSchema, (req) => req.query),
  loginUser
);
router.get("/me", auth, getUser);
router.get(
  "/:id",
  validate(mongoIdSchema, (req) => req.params),
  auth,
  hasRole(["ADMIN", "MODERATOR"]),
  getUser
);

export default router;
