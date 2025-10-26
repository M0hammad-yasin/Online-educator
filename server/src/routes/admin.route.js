import express from "express";
import {
  createAdmin,
  getAdmin,
  updateAdmin,
  loginAdmin,
  updatePassword,
  logOutAdmin,
  verifyEmail,
  patchAdmin,
  forgotPassword,
} from "../controllers/adminController/admin.controller.js";
import auth from "../middleware/auth.js";
import { validate } from "../middleware/validate.middleware.js";
import verifyPassword from "../middleware/comparePassword.middleware.js";
import {
  adminSchema,
  adminUpdateSchema,
  emailSchema,
  loginSchema,
} from "../validation/index.js";
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
  validate(adminUpdateSchema, (req) => req.body),
  auth,
  isAdmin,
  updateAdmin
);
router.post(
  "/login",
  validate(loginSchema, (req) => req.body),
  loginAdmin
);
router.put("/update-password", auth, isAdmin, verifyPassword, updatePassword);
router.get("/me", auth, isAdmin, getAdmin);
router.patch(
  "/me",
  validate(adminUpdateSchema, (req) => req.body),
  auth,
  isAdmin,
  patchAdmin
);
router.get("/logout", auth, logOutAdmin);
router.post("/forgot-password",validate(emailSchema,(req)=>req.body?.email), forgotPassword);
router.put("/verify-email", auth, isAdmin, verifyEmail);

export default router;
