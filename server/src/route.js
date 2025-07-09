import express from "express";
import error from "../src/Middleware/error.middleware.js";
import studentRoutes from "./routes/student.route.js";
import teacherRoutes from "./routes/teacher.route.js";
import classRoutes from "./routes/class.route.js";
import adminRoutes from "./routes/admin.route.js";
export default function (app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/api/student", studentRoutes);
  app.use("/api/teacher", teacherRoutes);
  app.use("/api/class", classRoutes);
  app.use("/api/admin", adminRoutes);
  app.use(error);
}
