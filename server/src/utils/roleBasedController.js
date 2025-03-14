import asyncWrapper from "./asyncWrapper.js";
export default (roles, controller) => {
  return asyncWrapper(async (req, res, next) => {
    // Ensure `roles` is always an array (e.g., ["admin"] or ["admin", "teacher"])
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    // Check if the user's role is allowed
    if (!allowedRoles.includes(req.user?.role)) next();

    // If authorized, execute the controller
    await controller(req, res, next);
  });
};
