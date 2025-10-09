import express from "express";
import {
  studentSchema,
  studentUpdateSchema,
  classFilterQuerySchema,
  paginationSchema,
  mongoIdSchema,
} from "../validation/index.js";
import {
  registerStudent,
  loginStudent,
  getStudent,
  updateStudent,
  updateStudentByAdmin,
  logoutStudent,
  deleteStudentByAdmin,
  getStudentsForSelection,
  getAllStudent,
  patchStudent,
  getStudentsWithClassCount,
  getStudentsWithClasses
} from "../controllers/StudentController/student.controller.js";
import auth from "../middleware/auth.js";
import { validate, validateBody } from "../middleware/validate.middleware.js";
import { hasRole, isStudent } from "../middleware/roleCheck.js";
import { Role } from "../constant.js";

const router = express.Router();
router.get(
  "/",
  validate(paginationSchema, (req) => req.query),
  validate(classFilterQuerySchema, (req) => req.query),
  auth,
  hasRole([Role.ADMIN, Role.MODERATOR, Role.TEACHER]),
  getAllStudent
);

router.get(
  "/classes",
  validate(paginationSchema, (req) => req.query),
  validate(classFilterQuerySchema, (req) => req.query),
  auth,
  hasRole([Role.ADMIN, Role.MODERATOR]),
  getStudentsWithClasses
);
router.get(
  "/class-count",
  validate(paginationSchema, (req) => req.query),
  validate(classFilterQuerySchema, (req) => req.query),
  auth,
  hasRole([Role.ADMIN, Role.MODERATOR]),
  getStudentsWithClassCount
);

router.post("/register", validateBody(studentSchema), registerStudent);
router.put(
  "/me",
  validate(studentUpdateSchema, (req) => req.query),
  auth,
  hasRole(Role.STUDENT),
  updateStudent
);
router.patch(
  "/me",
  validateBody(studentUpdateSchema),
  auth,
  hasRole(Role.STUDENT),
  patchStudent
);
router.post("/login", loginStudent);
router.post("/logout", auth, hasRole(Role.STUDENT), logoutStudent);
router.get("/me", auth, isStudent, getStudent);
router.get(
  "/select",
  auth,
  validate(paginationSchema, (req) => req.query),
  auth,
  hasRole([Role.ADMIN, Role.MODERATOR, Role.TEACHER]),
  getStudentsForSelection
);
router.get(
  "/:id",
  validate(mongoIdSchema, (req) => req.params),
  auth,
  hasRole([Role.ADMIN, Role.TEACHER, Role.MODERATOR]),
  getStudent
);
router.put(
  "/:id",
  validate(studentUpdateSchema, (req) => req.query),
  validate(mongoIdSchema, (req) => req.params),
  auth,
  hasRole([Role.ADMIN, Role.TEACHER, Role.MODERATOR]),
  updateStudentByAdmin
);
router.delete(
  "/:id",
  validate(mongoIdSchema, (req) => req.params),
  auth,
  hasRole([Role.ADMIN, Role.MODERATOR]),
  deleteStudentByAdmin
);
export default router;
