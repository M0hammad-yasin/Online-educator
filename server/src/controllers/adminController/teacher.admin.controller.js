import { sendSuccess } from "../../lib/api.response";
import { BadRequestError } from "../../lib/custom.error";
import prisma from "../../Prisma/prisma.client";
import { ObjectId } from "mongodb";
import asyncWrapper from "../../utils/asyncWrapper";

export const updateTeacherByAdmin = asyncWrapper(async (req, res) => {
  const { profilePicture, name, email, qualification, classRate, address } =
    req.body;
  const id = ObjectId(String(req.query.id));
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
  const teacher = await prisma.teacher.update({ where: { id }, data });
  sendSuccess(res, {
    statusCode: 200,
    message: "teacher updated Successfully",
    data: teacher,
  });
});

export const deleteTeacherByAdmin = asyncWrapper(async (req, res) => {
  const id = new ObjectId(String(req.query.id));
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
    data: deletedTeacher,
  });
});
export const getTeachersForSelection = asyncWrapper(async (req, res) => {
  const teachers = await prisma.teacher.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      profilePicture: true,
      qualification: true,
    },
  });
  res.status(200).json(teachers);
});
