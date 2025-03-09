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
import auth from "../middleware/auth.js";
import { validate } from "../middleware/validate.middleware.js";
import verifyPassword from "../middleware/comparePassword.middleware.js";
import {
  adminSchema,
  adminUpdateSchema,
} from "../validation/admin.validate.js";
import { isAdmin } from "../middleware/roleCheck.js";
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
  validate(loginAdmin, (req) => req.body),
  loginAdmin
);
router.put("/update-password", auth, isAdmin, verifyPassword, updatePassword);
router.get("/me", auth, isAdmin, getAdmin);
router.get("/logout", auth, logOutAdmin);
router.put("/verify-email", auth, isAdmin, verifyEmail);

export default router;
