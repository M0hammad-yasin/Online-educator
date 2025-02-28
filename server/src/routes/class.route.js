import express from "express";
import {
  validateBody,
  validateQuery,
} from "../middleware/validate.middleware.js";
import auth from "../middleware/auth.js";
import {
  classSchema,
  mongoIdSchema,
  updateClassSchema,
} from "../utils/validate.js"; // Your Zod schema for Class
import {
  createClass,
  getGroupedClasses,
  getUsersWithClasses,
  updateClass,
} from "../controllers/adminController/class.controller.js";

const router = express.Router();

// Route to create a new class
router.post("/create", validateBody(classSchema), createClass);
router.get("/teacherStats/:status", getUsersWithClasses);
router.get("/classStats/", getGroupedClasses);

// (Optional) Other routes for class operations can be added here:
// router.get("/:id", auth, getClassById);
router.put(
  "/:id",
  validateBody(updateClassSchema),
  validateQuery(mongoIdSchema),
  updateClass
);
// router.delete("/:id", auth, deleteClass);

export default router;
