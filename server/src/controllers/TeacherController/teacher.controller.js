import { sendSuccess } from "../../lib/api.response.js";
import { NotFoundError } from "../../lib/custom.error.js";
import prisma from "../../Prisma/prisma.client.js";
import asyncWrapper from "../../utils/asyncWrapper.js";
import { hashPassword, comparePassword } from "../../utils/bcrypt.js";
import { generateToken } from "../../utils/jwt.user.js";
import _ from "lodash";
// Register Teacher
export const registerTeacher = asyncWrapper(async (req, res) => {
  // Check if teacher already exists
  let teacher = await prisma.teacher.findUnique({
    where: { email: req.body.email },
  });
  if (teacher) {
    throw new BadRequestError("Email is already registered");
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
  sendSuccess(res, {
    statusCode: 201,
    message: "Teacher created successfully",
    data: { teacher: _.omit(teacher, ["passwordHash"]) },
  });
});

// Teacher Login
export const loginTeacher = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  // Check if teacher exists
  const teacher = await prisma.teacher.findUnique({ where: { email } });
  if (!teacher) {
    throw new NotFoundError("Email is not registered");
  }

  // Compare password
  const isMatch = await comparePassword(password, teacher.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Generate JWT token
  const token = generateToken(teacher);
  sendSuccess(res, {
    statusCode: 200,
    message: "Login successful",
    data: { token },
  });
});
// Update Teacher Profile
export const updateTeacher = asyncWrapper(async (req, res) => {
  const { profilePicture, name, email, qualification, classRate, address } =
    req.body;
  const id = req.user.userId;
  const check = await prisma.teacher.findUnique({ where: { id } });
  if (!check) {
    throw new NotFoundError("teacher not found");
  }
  if (email) {
    const existTeacher = await prisma.teacher.findUnique({ where: { email } });
    if (existTeacher) {
      throw new BadRequestError("email is already registered");
    }
  }
  const data = {
    ...(profilePicture && { profilePicture }),
    ...(name && { name }),
    ...(email && { email }),
    ...(qualification && { qualification }),
    ...(classRate && { classRate }),
    ...(address && { address }),
  };

  if (Object.keys(data).length === 0) {
    throw new BadRequestError("No data to update");
  }

  const teacher = await prisma.teacher.update({ where: { id }, data });
  sendSuccess(res, {
    statusCode: 200,
    message: "Teacher updated Successfully",
    data: { updatedTeacher: _.omit(teacher, ["passwordHash"]) },
  });
});
// Get Teacher Profile
export const getTeacher = asyncWrapper(async (req, res) => {
  const filter = {};
  if (req.params.id) {
    filter.id = req.params.id;
  } else {
    filter.id = req.user.userId;
  }
  const teacher = await prisma.teacher.findUnique({
    where: filter,
  });

  if (!teacher) {
    throw new NotFoundError("Teacher not found");
  }
  sendSuccess(res, {
    statusCode: 200,
    message: "Teacher found Successfully",
    data: { teacher: _.omit(teacher, ["passwordHash"]) },
  });
});
