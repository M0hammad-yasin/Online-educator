import _ from "lodash";
import { sendSuccess } from "../../lib/api.response";
import { BadRequestError } from "../../lib/custom.error";
import prisma from "../../Prisma/prisma.client";
import asyncWrapper from "../../utils/asyncWrapper";
import _ from "lodash";
export const getAllUsers = asyncWrapper(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  if (page < 1) throw new BadRequestError("page should be greater than 0");
  if (limit < 1) throw new BadRequestError("limit should be greater than 0");

  const parsedPage = Math.max(1, parseInt(page));
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (parsedPage - 1) * parsedLimit;
  const users = await prisma.user.findMany({
    skip,
    take: parsedLimit,
    select: {
      id: true,
      name: true,
      email: true,
      profilePicture: true,
    },
  });
  sendSuccess(res, {
    statusCode: 200,
    message: "Users fetched Successfully",
    data: { users },
  });
});
//update user by admin
export const updateUserByAdmin = asyncWrapper(async (req, res) => {
  const id = String(req.query.id);
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new BadRequestError("user not found");
  }
  if (req.body.email) {
    const existingUser = await prisma.user.findUnique({
      where: { email: req.body.email },
    });
    if (existingUser) {
      throw new BadRequestError("email is already registered");
    }
  }
  const updatedUser = await prisma.user.update({
    where: { id },
    data: req.body,
  });
  sendSuccess(res, {
    statusCode: 201,
    message: "user updated Successfully",
    data: { updatedUser: _.omit(updatedUser, ["passwordHash"]) },
  });
});
//delete user by admin
export const deleteUserByAdmin = asyncWrapper(async (req, res) => {
  const id = String(req.query.id);
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new BadRequestError("user not found");
  }
  const deletedUser = await prisma.user.delete({
    where: { id },
  });
  sendSuccess(res, {
    statusCode: 201,
    message: "user deleted Successfully",
    data: { deletedUser: _.omit(deletedUser, ["passwordHash"]) },
  });
});
