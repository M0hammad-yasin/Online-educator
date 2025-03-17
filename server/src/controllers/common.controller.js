import { sendSuccess } from "../Lib/api.response.js";
import prisma from "../Prisma/prisma.client.js";
import asyncWrapper from "../Utils/asyncWrapper.js";
import _ from "lodash";
export const updatePassword = asyncWrapper(async (req, res) => {
  const { password, model, userId } = req.user;
  const updatedUser = await prisma[model].update({
    where: { id: userId },
    data: { password },
  });
  sendSuccess(res, {
    statusCode: 201,
    message: "Password updated Successfully",
    data: { [model]: _.omit(updatedUser, "passwordHash") || updatedUser },
  });
});
