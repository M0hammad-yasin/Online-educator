// routes/userRoutes.ts
import express from "express";
import { createUser, getAllTeachers } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/create", createUser);
router.get("/get", getAllTeachers);

export default router;
