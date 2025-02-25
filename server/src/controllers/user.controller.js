import prisma from "../utils/prisma.client.js";

// Create User (Similar to Mongoose's User.create())
const createUser = async (req, res) => {
  console.log(req.body);
  try {
    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        passwordHash: req.body.password,
        role: req.body.role,
        // For teachers
        teacher:
          req.body.role === "TEACHER"
            ? {
                create: {
                  qualification: req.body.qualification,
                  hourlyRate: req.body.hourlyRate,
                },
              }
            : undefined,
      },
      include: { teacher: true }, // Similar to Mongoose populate()
    });
    res.status(201).json(user);
  } catch (error) {
    console.log("message : ", error);
    res.status(400).json({ error: "User creation failed" });
  }
};

// Get All Teachers (Like Teacher.find())
const getAllTeachers = async (req, res) => {
  const teachers = await prisma.teacher.findMany({
    include: { user: true }, // Populate user data
  });
  res.json(teachers);
};
export { createUser, getAllTeachers };
