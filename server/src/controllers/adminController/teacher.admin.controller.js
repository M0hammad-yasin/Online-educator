import _ from "lodash";
import { sendSuccess } from "../../lib/api.response.js";
import { BadRequestError } from "../../lib/custom.error.js";
import prisma from "../../Prisma/prisma.client.js";
import asyncWrapper from "../../utils/asyncWrapper.js";

export const updateTeacherByAdmin = asyncWrapper(async (req, res) => {
  const { profilePicture, name, email, qualification, classRate, address } =
    req.body;
  const id = String(req.query.id);
  const check = await prisma.teacher.findUnique({ where: { id } });
  if (!check) {
    throw new BadRequestError("teacher not found");
  }
  if (email) {
    const existTeacher = await prisma.teacher.findUnique({ where: { email } });
    if (existTeacher) {
      throw new BadRequestError("email already registered");
    }
  }
  const data = {
    ...(profilePicture && { profilePicture }),
    ...(name && { name }),
    ...(email && { email }),
    ...(qualification && { qualification }),
    ...(classRate && { classRate }),
    ...(role && { role }),
    ...(address && { address }),
  };
  if (Object.keys(data).length === 0) {
    throw new BadRequestError("No data to update");
  }
  const updatedTeacher = await prisma.teacher.update({ where: { id }, data });
  sendSuccess(res, {
    statusCode: 200,
    message: "teacher updated Successfully",
    data: { updatedTeacher: _.omit(updatedTeacher, ["passwordHash"]) },
  });
});

export const deleteTeacherByAdmin = asyncWrapper(async (req, res) => {
  const id = String(req.query.id);
  const teacher = await prisma.teacher.findUnique({ where: { id } });
  if (!teacher) {
    throw new BadRequestError("teacher not found");
  }
  const deletedTeacher = await prisma.teacher.delete({
    where: { id },
  });
  sendSuccess(res, {
    statusCode: 201,
    message: "teacher deleted Successfully",
    data: { deletedTeacher: _.omit(deletedTeacher, ["passwordHash"]) },
  });
});
export const getTeachersForSelection = asyncWrapper(async (req, res) => {
  const { page = 1, limit = 10, searchName = "" } = req.query;
  if (page < 1) {
    throw new BadRequestError("page should be greater than 0");
  }
  if (limit < 1) {
    throw new BadRequestError("limit should be greater than 0");
  }
  const parsedPage = Math.max(1, parseInt(page));
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (parsedPage - 1) * parsedLimit;
  const filter = {
    ...(searchName && { name: { contains: searchName, mode: "insensitive" } }),
  };
  const teachers = await prisma.teacher.findMany({
    where: filter,
    skip,
    take: parsedLimit,
    select: {
      id: true,
      name: true,
      email: true,
      profilePicture: true,
      qualification: true,
    },
  });

  sendSuccess(res, {
    statusCode: 200,
    message: "Teachers fetched Successfully",
    data: { teachers },
  });
});
//
