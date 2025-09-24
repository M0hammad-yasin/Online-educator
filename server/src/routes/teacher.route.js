import express from "express";
import {
  teacherSchema,
  teacherUpdateSchema,
} from "../validation/teacher.validate.js";
import { accessControlSchema } from "../validation/access.validate.js";
import { mongoIdSchema } from "../Validation/mongoId.validate.js";
import { loginSchema } from "../Validation/login.validate.js";
import { classFilterQuerySchema } from "../validation/class.validate.js";

import {
  registerTeacher,
  loginTeacher,
  getTeacher,
  getAllTeacher,
  updateTeacher,
  logoutTeacher,
  getTeacherClassCountForDay,
  getTeachersForSelection,
  updateTeacherByAdmin,
  deleteTeacherByAdmin,
  patchTeacher,
} from "../controllers/TeacherController/teacher.controller.js";
import auth from "../Middleware/auth.js";
import {
  validate,
  validateBody,
  validateQuery,
} from "../Middleware/validate.middleware.js";
import paginationSchema from "../Validation/pagination.validate.js";
import {
  getUsersWithClasses as teachersWithClasses,
  modifyAccess,
} from "../controllers/adminController/common.admin.controlller.js";
import {
  isAdmin,
  hasRole,
  roleBasedController,
} from "../middleware/roleCheck.js";
import { Role } from "../constant.js";
import { BadRequestError } from "../Lib/custom.error.js";
const router = express.Router();

router.get(
  "/",
  auth,
  validate(paginationSchema, (req) => req.query),
  hasRole([Role.ADMIN, Role.MODERATOR]),
  getAllTeacher
);
router.get(
  "/select",
  validate(paginationSchema, (req) => req.query),
  auth,
  hasRole(["ADMIN", "MODERATOR"]),
  getTeachersForSelection
);
router.post(
  "/class-day-count",
  validate(paginationSchema, (req) => req.query),
  auth,
  hasRole(["ADMIN", "MODERATOR"], ),
  getTeacherClassCountForDay
);

// router.post(
//   "/register",
//   validateBody(teacherSchema),
//   auth,
//   roleBasedController(["ADMIN", "MODERATOR"], registerTeacher)
// );

router.post("/register", validateBody(teacherSchema), registerTeacher);
router.post("/login", loginTeacher);
router.post("/logout", auth, logoutTeacher);

router.get("/me", auth, getTeacher);
router.patch(
  "/me",
  validateBody(teacherUpdateSchema),
  auth,
  hasRole(Role.TEACHER),
  patchTeacher
);

router.get(
  "/classes",
  validateQuery(classFilterQuerySchema),
  auth,
  hasRole([Role.ADMIN, Role.MODERATOR]),
  teachersWithClasses
);

router.get(
  "/:id",
  validate(mongoIdSchema, (req) => req.params),
  auth,
  hasRole([Role.ADMIN, Role.MODERATOR]),
  getTeacher
);
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
  roleBasedController({
    [Role.ADMIN]: updateTeacherByAdmin,
    [Role.MODERATOR]: updateTeacherByAdmin,
    [Role.TEACHER]: updateTeacher,
  })
);
router.put(
  "/me",
  validate(mongoIdSchema, (req) => req.params),
  validateBody(teacherUpdateSchema),
  auth,
  roleBasedController({
    [Role.ADMIN]: updateTeacherByAdmin,
    [Role.MODERATOR]: updateTeacherByAdmin,
    [Role.TEACHER]: updateTeacher,
  })
);
router.delete(
  "/:id",
  validate(mongoIdSchema, (req) => req.params),
  validateBody(mongoIdSchema),
  auth,
  hasRole([Role.ADMIN, Role.MODERATOR]),
  deleteTeacherByAdmin
);

export default router;
