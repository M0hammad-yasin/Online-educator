//create admin crud operation
import { comparePassword,hashPassword,BadRequestError,sendSuccess,generateToken,asyncWrapper } from "../../utils/index.js";
import prisma from "../../Prisma/prisma.client.js";
import config from "../../Config/config.js";
import _ from "lodash";

export const createAdmin = asyncWrapper(async (req, res) => {
  const hashedPassword = await hashPassword(req.body.password);
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
    data: admin ,
  });
});

export const getAdmin = asyncWrapper(async (req, res) => {
  const admin = await prisma.admin.findUnique({
    where: { id: req.user.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role:true,
      profilePicture: true,
      isEmailVerified: true,
    },
  });
  sendSuccess(res, {
    statusCode: 201,
    message: "Admin fetched Successfully",
    data: admin ,
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
    message: "Admin updated Successfully",
    data: admin ,
  });
});

export const updatePassword = asyncWrapper(async (req, res) => {
  const hashedPassword = await hashPassword(req.body.password);
  const admin = await prisma.admin.update({
    where: { id: req.user.userId },
    data: {
      passwordHash: hashedPassword,
    },
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
    message: "Password updated Successfully",
    data: admin ,
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
  const accessToken = generateToken(admin);
  const maxAge = parseInt(config.jwtSecretExpiry, 10);
  res.cookie("token", accessToken, {
    httpOnly: true,
    secure: config.isProduction, // Use secure in production
    sameSite: "strict",
    maxAge: maxAge * 1000, // Ensure maxAge is a number
  });
  sendSuccess(res, {
    statusCode: 200,
    message: "Admin logged in Successfully",
    data: {
      accessToken,
      user: _.pick(admin, [
        "id",
        "name",
        "email",
        "role",
        "profilePicture"
        // add any other safe fields you want to expose
      ])
    },
  });
});

export const verifyEmail = asyncWrapper(async (req, res) => {
  const admin = await prisma.admin.update({
    where: { id: req.user.userId },
    data: {
      isEmailVerified: true,
    },
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
    message: "Email verified Successfully",
    data: admin ,
  });
});

export const logOutAdmin = asyncWrapper(async (req, res) => {
  res.clearCookie("token");
  sendSuccess(res, {
    statusCode: 200,
    message: "Logged out successfully",
    data: null,
  });
});

export const patchAdmin = asyncWrapper(async (req, res) => {
  const id = req.user.userId;
  const data = req.body;
  if (Object.keys(data).length !== 1) {
    throw new BadRequestError("Only one field can be updated at a time.");
  }
  if (data.email) {
    const existingAdmin = await prisma.admin.findUnique({ where: { email: data.email } });
    if (existingAdmin) {
      throw new BadRequestError("email already registered");
    }
  }
  const check = await prisma.admin.findUnique({ where: { id } });
  if (!check) {
    throw new BadRequestError("admin doesn't exist");
  }
  const user = await prisma.admin.update({
    where: { id },
    data,
  });
  sendSuccess(res, {
    statusCode: 200,
    message: "Admin field updated successfully",
    data: _.omit(user,['passwordHash']),
  });
});
