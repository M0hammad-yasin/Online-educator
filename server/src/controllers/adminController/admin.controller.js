//create admin crud operation
import { comparePassword, hashPassword } from "../../utils/bcrypt.js";
import prisma from "../../Prisma/prisma.client.js";
import { BadRequestError } from "../../lib/custom.error";
import { sendSuccess } from "../../lib/api.response";
import { generateToken } from "../../utils/jwt.user.js";
export const createAdmin = asyncWrapper(async (req, res) => {
  const hashedPassword = await hashPassword(req.body.passwordHash);
  const data = {
    name: req.body?.name,
    email: req.body?.email,
    passwordHash: hashedPassword,
    profilePicture: req.body?.profilePicture,
    isEmailVerified: req.body?.isEmailVerified,
  };

  const existingAdmin = await prisma.admin.findFirst();
  if (existingAdmin) {
    throw new BadRequestError("can't create more than one admin");
  }
  const admin = await prisma.admin.create({
    data,
    select: {
      id: true,
      name: true,
      email: true,
      profilePicture: true,
      isEmailVerified: true,
    },
  });
  sendSuccess(res, {
    statusCode: 201,
    message: "Admin created Successfully",
    data: admin,
  });
});

export const getAdmin = asyncWrapper(async (req, res) => {
  const admin = await prisma.admin.findUnique({
    where: { id: req.user.userId },
    select: {
      id: true,
      name: true,
      email: true,
      profilePicture: true,
      isEmailVerified: true,
    },
  });
  sendSuccess(res, {
    statusCode: 201,
    message: "Admin fetched Successfully",
    data: admin,
  });
});
export const updateAdmin = asyncWrapper(async (req, res) => {
  const data = {
    ...(req.body?.name && { name: req.body?.name }),
    ...(req.body?.email && { email: req.body?.email }),
    ...(req.body?.profilePicture && {
      profilePicture: req.body?.profilePicture,
    }),
    ...(req.body?.isEmailVerified && {
      isEmailVerified: req.body?.isEmailVerified,
    }),
  };
  const admin = await prisma.admin.update({
    where: { id: req.user.userId },
    data,
  });
  sendSuccess(res, {
    statusCode: 201,
    message: "Admin updated Successfully",
    data: admin,
  });
});
export const updatePassword = asyncWrapper(async (req, res) => {
  const hashedPassword = await hashPassword(req.body.password);
  const admin = await prisma.admin.update({
    where: { id: req.user.userId },
    data: {
      passwordHash: hashedPassword,
    },
  });
  sendSuccess(res, {
    statusCode: 201,
    message: "Password updated Successfully",
    data: admin,
  });
});
export const loginAdmin = asyncWrapper(async (req, res) => {
  const where = {
    email: req.body.email,
  };
  const admin = await prisma.admin.findUnique({
    where,
  });
  if (!admin) {
    throw new BadRequestError("email is not registered");
  }
  const isMatch = await comparePassword(req.body.password, admin.passwordHash);
  if (!isMatch) {
    throw new BadRequestError("invalidpassword");
  }
  const token = generateToken(admin);
  sendSuccess(res, {
    statusCode: 201,
    message: "Admin logged in Successfully",
    data: token,
  });
});
