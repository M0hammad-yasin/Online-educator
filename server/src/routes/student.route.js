import express from "express";
import {
  studentSchema,
  studentUpdateSchema,
  classFilterQuerySchema,
  paginationSchema,
  mongoIdSchema,
  searchQuerySchema,
  emailSchema,
  loginSchema
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
  getStudentsWithClasses,
  searchStudents,
  forgotPassword
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

router.post("/", validateBody(studentSchema), registerStudent);
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
router.post("/login",validate(loginSchema,req=>req.body) ,loginStudent);
router.post("/logout", auth, hasRole(Role.STUDENT), logoutStudent);
router.post("/forgot-password",validate(emailSchema,(req)=>req.body), auth, hasRole(Role.STUDENT),forgotPassword);

router.get("/me", auth, isStudent, getStudent);
router.get('/search',
  validate(searchQuerySchema,(req)=>req.query),
  auth,
  hasRole([Role.ADMIN,Role.MODERATOR,Role.TEACHER]),
  searchStudents
)
router.get(
  "/select",
  auth,
  validate(paginationSchema, (req) => req.query),
  auth,
  hasRole([Role.ADMIN, Role.MODERATOR, Role.TEACHER]),
  getStudentsForSelection
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
