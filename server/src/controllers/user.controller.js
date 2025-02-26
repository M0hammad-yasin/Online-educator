import asyncWrapper from "../utils/asyncWrapper.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.user.js";
import prisma from "../Prisma/prisma.client.js";
import _ from "lodash";
const loginUser = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Compare password using bcrypt utility
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Generate JWT token using utility function
  const token = generateToken(user);

  res.status(200).json({ message: "Login successful", token });
});

// Create User (Wrapped with asyncWrapper)
const createUser = asyncWrapper(async (req, res) => {
  console.log(req.body);
  const existingUser = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }
  const hashedPassword = await hashPassword(req.body.password);

  const user = await prisma.user.create({
    data: {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword, // Make sure this is hashed
    },
  });

  res.status(201).json(_(user).omit("password"));
});

const getAllUsers = asyncWrapper(async (req, res) => {
  const users = await prisma.user.findMany();
  res.status(200).json(users);
});

const getUser = asyncWrapper(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(req.user.userId),
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
});

export { createUser, getAllUsers, getUser, loginUser };
