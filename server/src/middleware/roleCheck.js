import { AuthorizationError } from "../Lib/custom.error.js";
import asyncWrapper from "../Utils/asyncWrapper.js";

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
  return asyncWrapper(async (req, _, next) => {
    if (!Array.isArray(roles)) {
      roles = [roles];
    }

    if (!roles.includes(req.user?.role)) {
      throw new AuthorizationError(
        "You are not authorized to access this route"
      );
    }
    next();
  });
};
// middleware/roleBasedController.js

/**
 * Creates a role-based controller handler with O(1) complexity
 * @param {Object} roleControllers - Map of roles to controller functions
 * @returns {Function} Express middleware handler
 */
export const roleBasedController = (roleControllers) => {
  // Convert to Map for faster lookups and better security
  const roleMap = new Map(Object.entries(roleControllers));

  return asyncWrapper(async (req, res, next) => {
    const userRole = req.user?.role;
    const controller = roleMap.get(userRole);

    if (!controller)
      throw new AuthorizationError(
        "your are not authorized to access this resource"
      );
    // 4. Execute the controller with error handling
    await controller(req, res, next);
  });
};
