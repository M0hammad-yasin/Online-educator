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
    return res.status(403).json({ error: "Not authorized" });
  }

  req.classData = classData;
  next();
};
