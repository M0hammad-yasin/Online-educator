import express from "express";
import { studentSchema, loginSchema } from "../utils/validate.js";
import {
  registerStudent,
  loginStudent,
  getStudent,
} from "../controllers/StudentController/student.controller.js";
import auth from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.middleware.js";

const router = express.Router();

router.post("/register", validateBody(studentSchema), registerStudent);
router.post("/login", validateBody(loginSchema), loginStudent);
router.get("/me", auth, getStudent);

export default router;
