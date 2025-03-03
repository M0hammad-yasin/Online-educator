import { AuthorizationError } from "../lib/custom.error";

// Middleware for role-based access
export const checkRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: "Unauthorized access" });
  }
  next();
};

// Middleware to validate class ownership
export const checkClassOwnership = async (req, res, next) => {
  const classData = await prisma.class.findUnique({
    where: { id: req.params.id },
  });

  if (!classData) return res.status(404).json({ error: "Class not found" });

  if (req.user.role === "TEACHER" && classData.teacherId !== req.user.userId) {
    throw new AuthorizationError("you are not owner of this class");
  }

  req.classData = classData;
  next();
};
