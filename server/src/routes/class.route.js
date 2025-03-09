import express, { Router } from "express";
import { validate } from "../middleware/validate.middleware.js";
import auth from "../middleware/auth.js";
import {
  classFilterQuerySchema,
  classSchema,
  updateClassSchema,
} from "../validation/class.validate.js"; // Your Zod schema for Class
import { mongoIdSchema } from "../validation/mongoId.validate.js";
import {
  countAllClasses,
  countClasses,
  countClassesByFilter,
  createClass,
  deleteClass,
  getClass,
  getGroupedClasses,
  updateClass,
} from "../controllers/adminController/class.admin.controller.js";
import { getUsersWithClasses } from "../controllers/adminController/common.admin.controlller.js";
import { hasRole } from "../middleware/roleCheck.js";

const router = express.Router();

// Route to create a new class
router.post(
  "/create",
  validate(classSchema, (req) => req.body),
  auth,
  hasRole(["ADMIN", "MODERATOR", "TEACHER"]),
  createClass
);

// ----------------- GET ALL,FILTERED,GROUPED CLASSES --------------
router.get(
  "/",
  validate(classFilterQuerySchema, (req) => req.query),
  auth,
  hasRole(["ADMIN", "MODERATOR"]),
  getGroupedClasses
);

// ----------------- COUNT ALL,FILTERED CLASSES --------------
router.get(
  "/count",
  validate(classFilterQuerySchema, (req) => req.query),
  auth,
  hasRole(["ADMIN", "MODERATOR"]),
  countClasses
);

// ----------------- GET A CLASS --------------
router.get(
  "/:classId",
  auth,
  hasRole(["ADMIN", "MODERATOR", "TEACHER"]),
  getClass
);

// ----------------- UPDATE --------------
router.put(
  "/:id",
  validate(updateClassSchema, (req) => req.body),
  validate(mongoIdSchema, (req) => req.params),
  auth,
  hasRole(["ADMIN", "MODERATOR", "TEACHER"]),
  updateClass
);

// ----------------- DELETE --------------
router.delete(
  "/:id",
  validate(mongoIdSchema, (req) => req.params),
  auth,
  hasRole(["ADMIN", "MODERATOR", "TEACHER"]),
  deleteClass
);

export default router;
