import { Role } from "../constant.js";
import { AuthorizationError } from "../Lib/custom.error.js";
import asyncWrapper from "../Utils/asyncWrapper.js";

// Existing middleware functions//+
/**
 * check if authenticated user is admin
 * @returns {Function} Express middleware handler
 */
export const isAdmin = (req, _, next) => {
  if (req.user.role !== Role.ADMIN) {
    throw new AuthorizationError("You are not authorized to access this route");
  }
  next();
};
/**
 * check if authenticated user is teacher
 * @returns {Function} Express middleware handler
 */
export const isTeacher = (req, _, next) => {
  if (req.user.role !== Role.TEACHER) {
    throw new AuthorizationError("You are not authorized to access this route");
  }
  next();
};
/**
 * check if authenticated user is student
 * @returns {Function} Express middleware handler
 */
export const isStudent = (req, _, next) => {
  if (req.user.role !== Role.STUDENT) {
    throw new AuthorizationError("You are not authorized to access this route");
  }
  next();
};
/**
 * check if authenticated user is moderator
 * @returns {Function} Express middleware handler
 */
export const isModerator = (req, _, next) => {
  if (req.user.role !== Role.MODERATOR) {
    throw new AuthorizationError("You are not authorized to access this route");
  }
  next();
};

// New middleware function to check for multiple roles
/**
 * verify if authenticated user role is in array of role
 * @param {Object} roles - roles to check
 * @returns {Function} Express middleware handler
 */
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
/**
 * call a controller handler with O(1) complexity according to the role
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
