import express from "express";
import { teacherSchema, loginSchema } from "../utils/validate.js";
import {
  registerTeacher,
  loginTeacher,
  getTeacher,
} from "../controllers/teacher.controller.js";
import auth from "../middleware/auth.js";
import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();

router.post("/register", validate(teacherSchema), registerTeacher);
router.post("/login", validate(loginSchema), loginTeacher);
router.get("/me", auth, getTeacher);
export default router;
