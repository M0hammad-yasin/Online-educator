import prisma from "../Prisma/prisma.client.js";
import asyncWrapper from "../utils/asyncWrapper.js";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.user.js";
import _ from "lodash";
// Register Student
export const registerStudent = asyncWrapper(async (req, res) => {
  console.log(req.body);

  // Hash Password
  const hashedPassword = await hashPassword(req.body.passwordHash);

  const student = await prisma.student.create({
    data: {
      name: req.body.name,
      grade: req.body.grade,
      email: req.body.email,
      passwordHash: hashedPassword,
      parentEmail: req.body?.parentEmail,
      profilePicture: req.body?.profilePicture,
      role: "STUDENT",
    },
  });

  res.status(201).json({ message: "Student registered successfully", student });
});

// Student Login
export const loginStudent = asyncWrapper(async (req, res) => {
  const { email, passwordHash } = req.body;

  // Check if student exists
  const student = await prisma.student.findUnique({ where: { email } });
  if (!student) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Compare password
  const isMatch = await comparePassword(passwordHash, student.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Generate JWT token
  const token = generateToken(student);

  res.status(200).json({ message: "Login successful", token });
});

// Get Student Profile
export const getStudent = asyncWrapper(async (req, res) => {
  const student = await prisma.student.findUnique({
    where: { id: req.user.userId },
  });

  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }

  res.status(200).json(_(student).omit("passwordHash"));
});
