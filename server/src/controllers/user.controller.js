import prisma from "../Prisma/prisma.client.js";

// Create User (Similar to Mongoose's User.create())
import asyncWrapper from "../utils/asyncWrapper.js";

// Create User (Wrapped with asyncWrapper)
const createUser = asyncWrapper(async (req, res) => {
  console.log(req.body);

  const user = await prisma.user.create({
    data: {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password, // Make sure this is hashed
    },
  });

  res.status(201).json(user);
});
const getAllUsers = asyncWrapper(async (req, res) => {
  const users = await prisma.user.findMany();
  res.status(200).json(users);
});
const getUser = asyncWrapper(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
});
export { createUser, getAllUsers, getUser };
