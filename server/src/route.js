import userRoutes from "./Routes/user.route.js";
import express from "express";
import error from "../src/Middleware/error.middleware.js";
import studentRoutes from "./Routes/student.route.js";
import teacherRoutes from "./Routes/teacher.route.js";
import classRoutes from "./Routes/class.route.js";
import adminRoutes from "./Routes/admin.route.js";
export default function (app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/api/user", userRoutes);
  app.use("/api/student", studentRoutes);
  app.use("/api/teacher", teacherRoutes);
  app.use("/api/class", classRoutes);
  app.use("/--admin--", adminRoutes);
  app.use(error);
}
