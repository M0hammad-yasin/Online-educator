import express from "express";
import {
  createAdmin,
  getAdmin,
  updateAdmin,
  loginAdmin,
  updatePassword,
  logOutAdmin,
  verifyEmail,
} from "../controllers/adminController/admin.controller.js";
import auth from "../Middleware/auth.js";
import { validate } from "../Middleware/validate.middleware.js";
import verifyPassword from "../Middleware/comparePassword.middleware.js";
import {
  adminSchema,
  adminUpdateSchema,
} from "../Validation/admin.validate.js";
import { isAdmin } from "../middleware/roleCheck.js";
import { loginSchema } from "../Validation/login.validate.js";
const router = express.Router();

//- - - - - - - - - - - -   admin - - - - - - -- - - - - - - - -
router.post(
  "/register",
  validate(adminSchema, (req) => req.body),
  createAdmin
);
router.put(
  "/update",
  auth,
  isAdmin,
  validate(adminUpdateSchema, (req) => req.body),
  updateAdmin
);
router.post(
  "/login",
  validate(loginSchema, (req) => req.body),
  loginAdmin
);
router.put("/update-password", auth, isAdmin, verifyPassword, updatePassword);
router.get("/me", auth, isAdmin, getAdmin);
router.get("/logout", auth, logOutAdmin);
router.put("/verify-email", auth, isAdmin, verifyEmail);

export default router;
