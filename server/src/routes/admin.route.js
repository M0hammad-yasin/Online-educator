import express from "express";
import {
  accessControlSchema,
  adminSchema,
  adminUpdateSchema,
  classSchema,
  moderatorUpdateSchema,
  mongoIdSchema,
  studentUpdateSchema,
  teacherUpdateSchema,
  updateClassSchema,
  classFilterQuerySchema,
  loginSchema,
} from "../utils/validate.js";
import {
  createAdmin,
  getAdmin,
  updateAdmin,
  loginAdmin,
  updatePassword,
} from "../controllers/adminController/admin.controller.js";
import {
  getUsersWithClasses,
  modifyAccess,
} from "../controllers/adminController/common.admin.controlller.js";
import {
  updateTeacherByAdmin,
  deleteTeacherByAdmin,
} from "../controllers/adminController/teacher.admin.controller.js";
import {
  updateStudentByAdmin,
  deleteStudentByAdmin,
} from "../controllers/adminController/student.admin.controller.js";
import {
  updateModeratorByAdmin,
  deleteModeratorByAdmin,
} from "../controllers/adminController/moderator.admin.controller.js";
import auth from "../middleware/auth.js";
import {
  validateBody,
  validateQuery,
} from "../middleware/validate.middleware.js";
import verifyPassword from "../middleware/comparePassword.middleware.js";
import {
  createClass,
  updateClass,
  getClass,
  countAllClasses,
  deleteClass,
  getGroupedClasses,
  countClassesByFilter,
} from "../controllers/adminController/class.admin.controller.js";
import { getCalendarClasses } from "../controllers/common.controller.js";

const router = express.Router();

//- - - - - - - - - - - -   admin - - - - - - -- - - - - - - - -
router.post("/register", validateBody(adminSchema), createAdmin);
router.put("/update", auth, validateBody(adminUpdateSchema), updateAdmin);
router.post("/login", validateBody(loginSchema), loginAdmin);
router.put("/update-password", auth, verifyPassword, updatePassword);
router.get("/me", auth, getAdmin);
//////////////////////////////////////////////
//- - - - - - - - - - - -   access modification - - - - - - -- - - - - - - - -

//teacher
router.put(
  "/teacher/modify-access",
  validateQuery(mongoIdSchema),
  auth,
  modifyAccess
);
router.put(
  "/teacher/update",
  validateQuery(mongoIdSchema),
  validateBody(teacherUpdateSchema),
  auth,
  updateTeacherByAdmin
);
router.put(
  "/teacher/delete",
  validateQuery(mongoIdSchema),
  validateBody(mongoIdSchema),
  auth,
  deleteTeacherByAdmin
);
router.get(
  "/teacher-class-count/:status",
  validateQuery(classFilterQuerySchema),
  auth,
  getUsersWithClasses
);

//student
router.put(
  "/student/update",
  validateQuery(mongoIdSchema),
  validateBody(studentUpdateSchema),
  auth,
  updateStudentByAdmin
);
router.put(
  "/student/delete",
  validateQuery(mongoIdSchema),
  auth,
  deleteStudentByAdmin
);
router.get(
  "/student-class-count/:status",
  validateQuery(classFilterQuerySchema),
  auth,
  getUsersWithClasses
);
//moderator
router.put(
  "/moderator/update",
  validateBody(moderatorUpdateSchema),
  auth,
  updateModeratorByAdmin
);
router.put(
  "/moderator/delete",
  validateQuery(mongoIdSchema),
  auth,
  deleteModeratorByAdmin
);
router.put(
  "/moderator/modify-access",
  validateQuery(mongoIdSchema),
  validateBody(accessControlSchema),
  auth,
  modifyAccess
);

//- - - - - - - - - - - -   class - - - - - - -- - - - - - - - -
router.post("/class/create", validateBody(classSchema), auth, createClass);
router.put(
  "/class/update",
  validateQuery(mongoIdSchema),
  validateBody(updateClassSchema),
  auth,
  updateClass
);
router.get("/class/:classId", auth, getClass);
router.delete("/class/delete", validateQuery(mongoIdSchema), auth, deleteClass);
router.get(
  "/class/grouped",
  validateQuery(classFilterQuerySchema),
  auth,
  getGroupedClasses
);
router.get("/calendar", auth, getCalendarClasses);
router.get("/class/count", auth, countAllClasses);
router.get("/class/count-all", auth, countAllClasses);
router.get(
  "/class/count-filter",
  validateQuery(classFilterQuerySchema),
  auth,
  countClassesByFilter
);

export default router;
