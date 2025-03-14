import { sendSuccess } from "../../Lib/api.response.js";
import { BadRequestError } from "../../Lib/custom.error.js";
import prisma from "../../Prisma/prisma.client.js";
import asyncWrapper from "../../Utils/asyncWrapper.js";

export const updateModeratorByAdmin = asyncWrapper(async (req, res) => {
  const { profilePicture, name, email, address } = req.body;
  const id = req.query.id;
  const check = await prisma.student.findUnique({ where: { id } });
  if (!check) {
    throw new BadRequestError("moderator doesn't exist");
  }
  if (email) {
    const existingMod = await prisma.moderator.findUnique({
      where: { email },
    });
    if (existingMod) {
      throw new BadRequestError("email already registered");
    }
  }
  const data = {
    ...(profilePicture && { profilePicture }),
    ...(name && { name }),
    ...(email && { email }),
    ...(address && { address }),
  };
  if (Object.keys(data).length === 0) {
    throw new BadRequestError("No data to update");
  }
  const moderator = await prisma.moderator.update({
    where: { id },
    data,
  });
  sendSuccess(res, {
    statusCode: 200,
    message: "moderator updated Successfully",
    data: moderator,
  });
});

export const deleteModeratorByAdmin = asyncWrapper(async (req, res) => {
  const { id } = req.query;
  const moderator = await prisma.moderator.findUnique({ where: { id } });
  if (!moderator) {
    throw new BadRequestError("moderator not found");
  }
  const delMod = await prisma.moderator.delete({
    where: { id },
  });
  sendSuccess(res, {
    statusCode: 201,
    message: "moderator deleted Successfully",
    data: delMod,
  });
});
