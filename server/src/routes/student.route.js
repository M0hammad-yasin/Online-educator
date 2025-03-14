import express from "express";
import { loginSchema } from "../Validation/login.validate.js";
import {
  studentSchema,
  studentUpdateSchema,
} from "../Validation/student.validate.js";
import { classFilterQuerySchema } from "../Validation/class.validate.js";
import { getUsersWithClasses as getStudentsWithClasses } from "../controllers/adminController/common.admin.controlller.js";
import paginationSchema from "../Validation/pagination.validate.js";
import { mongoIdSchema } from "../Validation/mongoId.validate.js";
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
} from "../controllers/StudentController/student.controller.js";
import { getUsersWithClasses as studentsWithClasses } from "../controllers/adminController/common.admin.controlller.js";
import auth from "../Middleware/auth.js";
import { validate, validateBody } from "../Middleware/validate.middleware.js";
import { hasRole } from "../middleware/roleCheck.js";
import { Role } from "../constant.js";

const router = express.Router();
router.get(
  "/",
  validate(paginationSchema, (req) => req.query),
  validate(classFilterQuerySchema, (req) => req.query),
  auth,
  hasRole([Role.ADMIN, Role.MODERATOR]),
  getAllStudent
);

router.get(
  "/classes/",
  validate(classFilterQuerySchema, (req) => req.query),
  auth,
  hasRole([Role.ADMIN, Role.MODERATOR]),
  getStudentsWithClasses
);

router.post("/register", validateBody(studentSchema), registerStudent);
router.put(
  "/me/update",
  validate(studentUpdateSchema, (req) => req.query),
  auth,
  hasRole(Role.STUDENT),
  updateStudent
);
router.get(
  "/classes",
  validate(classFilterQuerySchema, (req) => req.query),
  auth,
  hasRole(["ADMIN", "MODERATOR"]),
  studentsWithClasses
);
router.post("/login", validateBody(loginSchema), loginStudent);
router.post("/logout", auth, hasRole(Role.STUDENT), logoutStudent);
router.get("/me", auth, getStudent);
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
  ":id",
  validate(mongoIdSchema, (req) => req.params),
  auth,
  hasRole([Role.ADMIN, Role.MODERATOR]),
  deleteStudentByAdmin
);
export default router;
