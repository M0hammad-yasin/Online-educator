import express from "express";
import {
  teacherSchema,
  teacherUpdateSchema,
} from "../validation/teacher.validate.js";
import { accessControlSchema } from "../validation/access.validate.js";
import { mongoIdSchema } from "../validation/mongoId.validate.js";
import { teacherUpdateSchema } from "../validation/mongoId.validate.js";
import { loginSchema } from "../validation/login.validate.js";
import { classFilterQuerySchema } from "../validation/class.validate.js";

import {
  registerTeacher,
  loginTeacher,
  getTeacher,
  updateTeacher,
} from "../controllers/TeacherController/teacher.controller.js";
import auth from "../middleware/auth.js";
import {
  validate,
  validateBody,
  validateQuery,
} from "../middleware/validate.middleware.js";
import {
  getUsersWithClasses as teachersWithClasses,
  modifyAccess,
} from "../controllers/adminController/common.admin.controlller.js";
import { hasRole, isAdmin } from "../middleware/roleCheck.js";
import { getClassesGroupedCount } from "../controllers/classController/class.controller.js";
import roleBasedController from "../utils/roleBasedController.js";
import {
  deleteTeacherByAdmin,
  updateTeacherByAdmin,
} from "../controllers/adminController/teacher.admin.controller.js";

const router = express.Router();

router.post(
  "/register",
  validateBody(teacherSchema),
  auth,
  roleBasedController(["ADMIN", "MODERATOR"], registerTeacher)
);
router.post("/register", validateBody(teacherSchema), registerTeacher);
router.post("/login", validateBody(loginSchema), loginTeacher);
router.get("/me", auth, getTeacher);

router.get(
  "/class",
  validateQuery(classFilterQuerySchema),
  auth,
  hasRole(["ADMIN", "MODERATOR"]),
  teachersWithClasses
);
router.get(
  "/class-count-by-group",
  validateQuery(classFilterQuerySchema),
  auth,
  hasRole(["ADMIN", "MODERATOR", "TEACHER", "STUDENT"]),
  getClassesGroupedCount
);
router.get("/:id", auth, hasRole(["ADMIN", "MODERATOR"]), getTeacher);
router.put(
  "/:id/access-control",
  validate(mongoIdSchema, (req) => req.params),
  validate(accessControlSchema, (req) => req.query),
  auth,
  isAdmin,
  modifyAccess
);
router.put(
  "/:id",
  validate(mongoIdSchema, (req) => req.params),
  validateBody(teacherUpdateSchema),
  auth,
  roleBasedController("TEACHER", updateTeacher)
);
router.put(
  "/:id",
  validate(mongoIdSchema),
  validateBody(teacherUpdateSchema),
  auth,
  roleBasedController(["ADMIN", "MODERATOR"], updateTeacherByAdmin)
);
router.delete(
  "/:id",
  validateQuery(mongoIdSchema),
  validateBody(mongoIdSchema),
  auth,
  hasRole(["ADMIN", "MODERATOR"]),
  deleteTeacherByAdmin
);

export default router;
