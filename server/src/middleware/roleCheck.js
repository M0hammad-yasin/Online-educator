import { AuthorizationError } from "../lib/custom.error.js";

export const isAdmin = (req, _, next) => {
  if (req.user.role !== "ADMIN") {
    throw new AuthorizationError("You are not authorized to access this route");
  }
  next();
};
export const isTeacher = (req, _, next) => {
  if (req.user.role !== "TEACHER") {
    throw new AuthorizationError("You are not authorized to access this route");
  }
  next();
};
export const isStudent = (req, _, next) => {
  if (req.user.role !== "STUDENT") {
    throw new AuthorizationError("You are not authorized to access this route");
  }
  next();
};
export const isModerator = (req, _, next) => {
  if (req.user.role !== "MODERATOR") {
    throw new AuthorizationError("You are not authorized to access this route");
  }
  next();
};
