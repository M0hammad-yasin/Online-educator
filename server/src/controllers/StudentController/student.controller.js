import asyncWrapper from "../../utils/asyncWrapper.js";
import { comparePassword, hashPassword } from "../../utils/bcrypt.js";
import { generateToken } from "../../utils/jwt.user.js";
import prisma from "../../Prisma/prisma.client.js";
import _ from "lodash";
import { BadRequestError, NotFoundError } from "../../lib/custom.error.js";
import { sendSuccess } from "../../lib/api.response.js";
// Register Student
export const registerStudent = asyncWrapper(async (req, res) => {
  // Hash Password
  const hashedPassword = await hashPassword(req.body.password);
  const existingStudent = await prisma.student.findUnique({
    where: { email: req.body.email },
  });
  if (existingStudent) {
    throw new BadRequestError("email already registered");
  }
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
  const { email, password } = req.body;

  // Check if student exists
  const student = await prisma.student.findUnique({ where: { email } });
  if (!student) {
    throw new NotFoundError("email is not registered");
  }

  // Compare password
  const isMatch = await comparePassword(password, student.passwordHash);
  if (!isMatch) {
    throw new BadRequestError("Invalid password");
  }

  // Generate JWT token
  const token = generateToken(student);

  sendSuccess(res, {
    statusCode: 200,
    message: "Login successful",
    data: { token },
  });
});

// Get Student Profile
export const getStudent = asyncWrapper(async (req, res) => {
  const filter = { id: req.user.userId };
  const student = await prisma.student.findUnique({
    where: filter,
  });

  if (!student) {
    throw new NotFoundError("Student not found");
  }

  sendSuccess(res, {
    statusCode: 200,
    message: "Student fetched Successfully",
    data: { student: _(student).omit(["passwordHash"]) },
  });
});
export const getStudentsForSelection = asyncWrapper(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  if (page < 1) {
    throw new BadRequestError("paeg should be greater than 0");
  }
  if (limit < 1) {
    throw new BadRequestError("limit should be greater than 0");
  }
  const parsedPage = Math.max(1, parseInt(page));
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (parsedPage - 1) * parsedLimit;
  const students = await prisma.student.findMany({
    skip,
    take: parsedLimit,
    select: {
      id: true,
      name: true,
      email: true,
      profilePicture: true,
      qualification: true,
    },
  });
  sendSuccess(res, {
    statusCode: 200,
    message: "Teachers fetched Successfully",
    data: { students },
  });
});
