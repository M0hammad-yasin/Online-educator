import express from "express";
import {
  teacherSchema,
  loginSchema,
  classFilterQuerySchema,
} from "../utils/validate.js";
import {
  registerTeacher,
  loginTeacher,
  getTeacher,
} from "../controllers/TeacherController/teacher.controller.js";
import auth from "../middleware/auth.js";
import {
  validateBody,
  validateQuery,
} from "../middleware/validate.middleware.js";
import { getUsersWithClasses } from "../controllers/adminController/common.admin.controlller.js";
import { isTeacher } from "../middleware/roleCheck.js";
import { getClassesGroupedCount } from "../controllers/classController/class.controller.js";

const router = express.Router();

router.post("/register", validateBody(teacherSchema), registerTeacher);
router.post("/login", validateBody(loginSchema), loginTeacher);
router.get("/me", auth, getTeacher);

router.get(
  "/teacher-class-count/:status",
  validateQuery(classFilterQuerySchema),
  auth,
  getUsersWithClasses
);
router.get(
  "/class-count-by-group",
  validateQuery(classFilterQuerySchema),
  auth,
  isTeacher,
  getClassesGroupedCount
);
router.get("/:id", getTeacher);
export default router;
