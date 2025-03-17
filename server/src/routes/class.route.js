import express, { Router } from "express";
import { validate } from "../Middleware/validate.middleware.js";
import auth from "../Middleware/auth.js";
import {
  classFilterQuerySchema,
  classSchema,
  updateClassSchema,
} from "../Validation/class.validate.js"; // Your Zod schema for Class
import { mongoIdSchema } from "../Validation/mongoId.validate.js";
import {
  calendarViewClassData,
  countClassesByGroup,
  createClass,
  deleteClass,
  getAllClasses,
  getAllClassesForAdmin,
  getClassById,
  getClassCount,
  getClassCountForAdmin,
  getClassesForSelection,
  getClassesForSelectionByAdmin,
  getGroupedClasses,
  updateClass,
} from "../controllers/classController/class.controller.js";
import { hasRole, roleBasedController } from "../middleware/roleCheck.js";
import { Role } from "../constant.js";
import paginationSchema from "../Validation/pagination.validate.js";
import asyncWrapper from "../Utils/asyncWrapper.js";

const router = express.Router();

// Route to create a new class
router.post(
  "/create",
  validate(classSchema, (req) => req.body),
  auth,
  hasRole([Role.ADMIN, Role.MODERATOR, Role.TEACHER]),
  createClass
);

// ----------------- GET ALL,FILTERED CLASSES --------------

router.get(
  "/",
  validate(classFilterQuerySchema, (req) => req.query),
  auth,
  hasRole([Role.ADMIN, Role.MODERATOR, Role.TEACHER, Role.STUDENT]),
  roleBasedController({
    [Role.ADMIN]: asyncWrapper(getAllClassesForAdmin),
    [Role.MODERATOR]: asyncWrapper(getAllClassesForAdmin),
    [Role.STUDENT]: asyncWrapper(getAllClasses),
    [Role.TEACHER]: asyncWrapper(getAllClasses),
  })
);
// ----------------- GET ClASSES FOR QUICK SELECTION --------------
router.get(
  "/select",
  validate(paginationSchema, (req) => req.query),
  auth,
  roleBasedController({
    [Role.ADMIN]: asyncWrapper(getClassesForSelectionByAdmin),
    [Role.MODERATOR]: asyncWrapper(getClassesForSelectionByAdmin),
    [Role.TEACHER]: asyncWrapper(getClassesForSelection),
  })
);
// ----------------- GET COUNTED,GROUPED CLASSES --------------

router.get(
  "/count-by-group",
  validate(classFilterQuerySchema, (req) => req.query),
  auth,
  hasRole([Role.ADMIN, Role.MODERATOR, Role.TEACHER, Role.STUDENT]),
  countClassesByGroup
);
// ----------------- GET ALL GROUPED CLASSES --------------

router.get(
  "/group",
  validate(classFilterQuerySchema, (req) => req.query),
  auth,
  hasRole([Role.ADMIN, Role.MODERATOR, Role.TEACHER, Role.STUDENT]),
  getGroupedClasses
);
// ----------------- GET ALL CLASSES WITH CALANDER VIEW --------------

router.get(
  "/calander-view/",
  validate(classFilterQuerySchema, (req) => req.query),
  auth,
  hasRole([Role.ADMIN, Role.MODERATOR, Role.TEACHER, Role.STUDENT]),
  calendarViewClassData
);
// ----------------- COUNT ALL,FILTERED CLASSES --------------
router.get(
  "/count",
  validate(paginationSchema, (req) => req.query),
  auth,
  hasRole([Role.ADMIN, Role.MODERATOR, Role.TEACHER, Role.STUDENT]),
  roleBasedController({
    [Role.ADMIN]: asyncWrapper(getClassCountForAdmin),
    [Role.MODERATOR]: asyncWrapper(getClassCountForAdmin),
    [Role.STUDENT]: asyncWrapper(getClassCount),
    [Role.TEACHER]: asyncWrapper(getClassCount),
  })
);

// ----------------- GET A CLASS --------------
router.get(
  "/:id",
  validate(mongoIdSchema, (req) => req.params),
  auth,
  hasRole([Role.ADMIN, Role.MODERATOR, Role.TEACHER, Role.STUDENT]),
  getClassById
);

// ----------------- UPDATE --------------
router.put(
  "/:id",
  validate(updateClassSchema, (req) => req.body),
  validate(mongoIdSchema, (req) => req.params),
  auth,
  hasRole([Role.ADMIN, Role.MODERATOR, Role.TEACHER]),
  updateClass
);

// ----------------- DELETE --------------
router.delete(
  "/:id",
  validate(mongoIdSchema, (req) => req.params),
  auth,
  hasRole([Role.ADMIN, Role.MODERATOR, Role.TEACHER]),
  deleteClass
);

export default router;
