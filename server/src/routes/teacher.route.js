import express from "express";
import { teacherSchema, loginSchema } from "../utils/validate.js";
import {
  registerTeacher,
  loginTeacher,
  getTeacher,
} from "../controllers/teacher.controller.js";
import auth from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.middleware.js";

const router = express.Router();

router.post("/register", validateBody(teacherSchema), registerTeacher);
router.post("/login", validateBody(loginSchema), loginTeacher);
router.get("/me", auth, getTeacher);
router.get("/:id", getTeacher);
export default router;
