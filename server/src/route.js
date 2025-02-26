import userRoutes from "./routes/user.route.js";
import error from "../src/middleware/error.middleware.js";
import studentRoutes from "./routes/student.route.js";
import teacherRoutes from "./routes/teacher.route.js";
export default function (app) {
  app.use("/api/user", userRoutes);
  app.use("/api/student", studentRoutes);
  app.use("/api/teacher", teacherRoutes);
  app.use(error);
}
