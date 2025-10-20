import express from "express";
import {
  teacherSchema,
  teacherUpdateSchema,
  accessControlSchemaBody,
  accessControlSchemaQuery,
  mongoIdSchema,
  loginSchema,
  classFilterQuerySchema,
  paginationSchema,
  searchQuerySchema,
} from "../validation/index.js";

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
  getTeachersWithClasses,
  getTeachersWithClassCount,
  modifyTeacherAccess,
  searchTeachers,
} from "../controllers/TeacherController/teacher.controller.js";
import auth from "../middleware/auth.js";
import {
  validate,
} from "../middleware/validate.middleware.js";
import {
  isAdmin,
  hasRole,
} from "../middleware/roleCheck.js";
import { Role } from "../constant.js";
const router = express.Router();

router.get(
  "/",
  auth,
  validate(paginationSchema, (req) => req.query),
  hasRole([Role.ADMIN, Role.MODERATOR]),
  getAllTeacher
);
router.get('/search',
  validate(searchQuerySchema,(req)=>req.query),
  auth,
  hasRole([Role.ADMIN,Role.MODERATOR]),
  searchTeachers
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

router.post("/register", validate(teacherSchema,(req) => req.body), registerTeacher);
router.post("/login",validate(loginSchema, (req) => req.body), loginTeacher);
router.post("/logout", auth, logoutTeacher);

router.get("/me", auth,hasRole(Role.TEACHER), getTeacher);
router.put(
  "/me",
  validate(teacherUpdateSchema, (req) => req.query),
  auth,
  hasRole(Role.TEACHER),
  updateTeacher
);
router.patch(
  "/me",
  validate(teacherUpdateSchema,(req) => req.body),
  auth,
  hasRole(Role.TEACHER),
  patchTeacher
);
router.get(
  "/classes",
  validate(paginationSchema, (req) => req.query),
  validate(classFilterQuerySchema, (req) => req.query),
  auth,
  hasRole([Role.ADMIN, Role.MODERATOR]),
  getTeachersWithClasses
);

router.get(
  "/class-count",
  validate(paginationSchema, (req) => req.query),
  validate(classFilterQuerySchema, (req) => req.query),
  auth,
  hasRole([Role.ADMIN, Role.MODERATOR]),
  getTeachersWithClassCount
);
router.get(
  "/class-day-count",
  validate(paginationSchema, (req) => req.query),
  validate(classFilterQuerySchema, (req) => req.query),
  auth,
  hasRole([Role.ADMIN, Role.MODERATOR]),
  getTeacherClassCountForDay
);
router.get(
  '/select',
  validate(paginationSchema, (req) => req.query),
  auth,
  hasRole([Role.ADMIN, Role.MODERATOR]),
  getTeachersForSelection
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
  validate(accessControlSchemaQuery, (req) => req.query),
  validate(accessControlSchemaBody, (req) => req.body),
  auth,
  isAdmin,
  modifyTeacherAccess
);
router.put(
  "/:id",
  validate(mongoIdSchema, (req) => req.params),
  validate(teacherUpdateSchema, (req) => req.body),
  auth,
  hasRole([Role.ADMIN, Role.MODERATOR]),
  updateTeacherByAdmin
);
router.delete(
  "/:id",
  validate(mongoIdSchema, (req) => req.params),
  auth,
  hasRole([Role.ADMIN, Role.MODERATOR]),
  deleteTeacherByAdmin
);

export default router;
