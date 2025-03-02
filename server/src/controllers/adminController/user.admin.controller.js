import { sendSuccess } from "../../lib/api.response";
import { BadRequestError } from "../../lib/custom.error";
import prisma from "../../Prisma/prisma.client";
import asyncWrapper from "../../utils/asyncWrapper";

export const getAllUsers = asyncWrapper(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
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
    data: users,
  });
});
