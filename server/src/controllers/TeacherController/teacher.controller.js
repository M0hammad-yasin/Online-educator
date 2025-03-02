import prisma from "../../Prisma/prisma.client.js";
import asyncWrapper from "../../utils/asyncWrapper.js";
import { hashPassword, comparePassword } from "../../utils/bcrypt.js";
import { generateToken } from "../../utils/jwt.user.js";
import _ from "lodash";
// Register Teacher
export const registerTeacher = asyncWrapper(async (req, res) => {
  console.log(req.body);
  let teacher = await prisma.teacher.findUnique({
    where: { email: req.body.email },
  });
  if (teacher) {
    return res.status(400).json({ error: "Teacher already exists" });
  }
  // Hash Password
  const hashedPassword = await hashPassword(req.body.password);

  teacher = await prisma.teacher.create({
    data: {
      name: req.body.name,
      email: req.body.email,
      passwordHash: hashedPassword,
      profilePicture: req.body?.profilePicture || null,
      qualification: req.body.qualification,
      classRate: parseInt(req.body?.hourlyRate),
      role: "TEACHER",
    },
  });

  res.status(201).json({ message: "Teacher registered successfully", teacher });
});

// Teacher Login
export const loginTeacher = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  console.log(req.body.email);
  // Check if teacher exists
  const teacher = await prisma.teacher.findUnique({ where: { email } });
  if (!teacher) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Compare password
  const isMatch = await comparePassword(password, teacher.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Generate JWT token
  const token = generateToken(teacher);

  res.status(200).json({ message: "Login successful", token });
});

// Get Teacher Profile
export const getTeacher = asyncWrapper(async (req, res) => {
  const filter = {};
  if (req.query.id) {
    filter.id = req.query.id;
  } else {
    filter.id = req.params.id;
  }
  const teacher = await prisma.teacher.findUnique({
    where: filter,
  });

  if (!teacher) {
    return res.status(404).json({ error: "Teacher not found" });
  }

  res.status(200).json(_(teacher).omit(["passwordHash"]));
});
