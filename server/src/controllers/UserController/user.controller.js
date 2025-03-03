import asyncWrapper from "../../utils/asyncWrapper.js";
import { comparePassword, hashPassword } from "../../utils/bcrypt.js";
import { generateToken } from "../../utils/jwt.user.js";
import prisma from "../../Prisma/prisma.client.js";
import _ from "lodash";
import { BadRequestError, NotFoundError } from "../../lib/custom.error.js";
import { sendSuccess } from "../../lib/api.response.js";
const loginUser = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new NotFoundError("email is not registered");

  // Compare password using bcrypt utility
  const isMatch = await comparePassword(password, user.passwordHash);
  if (!isMatch) new BadRequestError("Invalid  password");
  // Generate JWT token using utility function
  const token = generateToken(user);
  sendSuccess(res, {
    statusCode: 200,
    message: "Login successful",
    data: { token },
  });
});

// Create User (Wrapped with asyncWrapper)
const createUser = asyncWrapper(async (req, res) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });
  if (existingUser) throw new BadRequestError("email is already registered");
  const hashedPassword = await hashPassword(req.body.password);

  const user = await prisma.user.create({
    data: {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword, // Make sure this is hashed
    },
  });
  sendSuccess(res, {
    statusCode: 201,
    message: "User created successfully",
    data: { user },
  });
});

const getUser = asyncWrapper(async (req, res) => {
  const filter = { id: req.params.id ? req.params.id : req.user.userId };
  const user = await prisma.user.findUnique({
    where: filter,
  });

  if (!user) throw new NotFoundError("User not found");
  sendSuccess(res, {
    statusCode: 200,
    message: "User fetched successfully",
    data: { user },
  });
});

export { createUser, getUser, loginUser };
