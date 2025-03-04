import { AuthorizationError } from "../lib/custom.error.js";

// Existing middleware functions//+
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

// New middleware function to check for multiple roles
export const hasRole = (roles) => {
  return (req, _, next) => {
    if (!Array.isArray(roles)) {
      roles = [roles];
    }

    if (!roles.includes(req.user.role)) {
      throw new AuthorizationError(
        "You are not authorized to access this route"
      );
    }

    next();
  };
};
