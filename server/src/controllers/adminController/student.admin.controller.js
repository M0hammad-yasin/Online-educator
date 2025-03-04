import { sendSuccess } from "../../lib/api.response.js";
import { BadRequestError } from "../../lib/custom.error.js";
import prisma from "../../Prisma/prisma.client.js";
import asyncWrapper from "../../utils/asyncWrapper.js";
import _ from "lodash";
export const updateStudentByAdmin = asyncWrapper(async (req, res) => {
  const { profilePicture, name, email, parentEmail, grade, address, region } =
    req.body;
  const id = req.query.id;
  const check = await prisma.student.findUnique({ where: { id } });
  if (!check) {
    throw new BadRequestError("student doesn't exist");
  }
  if (email) {
    const existingStudent = await prisma.student.findUnique({
      where: { email },
    });
    if (existingStudent) {
      throw new BadRequestError("email already registered");
    }
  }
  const data = {
    ...(profilePicture && { profilePicture }),
    ...(name && { name }),
    ...(email && { email }),
    ...(address && { address }),
    ...(region && { region }),
    ...(parentEmail && { parentEmail }),
    ...(grade && { grade }),
  };
  if (Object.keys(data).length === 0) {
    throw new BadRequestError("No data to update");
  }
  const student = await prisma.student.update({
    where: { id },
    data,
  });
  sendSuccess(res, {
    statusCode: 200,
    message: "teacher updated Successfully",
    data: student,
  });
});

export const deleteStudentByAdmin = asyncWrapper(async (req, res) => {
  const { id } = req.query;
  const student = await prisma.student.findUnique({ where: { id } });
  if (!student) {
    throw new BadRequestError("student not found");
  }
  const delStudent = await prisma.student.delete({
    where: { id },
  });
  sendSuccess(res, {
    statusCode: 201,
    message: "student deleted Successfully",
    data: { delStudent: _.omit(delStudent, ["passwordHash"]) },
  });
});
