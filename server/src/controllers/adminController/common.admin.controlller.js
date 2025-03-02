import { z } from "zod";
import { sendSuccess } from "../../lib/api.response";
import { BadRequestError } from "../../lib/custom.error";
import prisma from "../../Prisma/prisma.client";
import asyncWrapper from "../../utils/asyncWrapper";

export const modifyAccess = asyncWrapper(async (req, res) => {
  const {
    canSeeUser,
    canAddUser,
    canDeleteUser,
    canUpdateUser,
    canSeeTeacher,
    canAddTeacher,
    canDeleteTeacher,
    canUpdateTeacher,
    canSeeStudent,
    canAddStudent,
    canDeleteStudent,
    canUpdateStudent,
    canSeeClass,
    canAddClass,
    canDeleteClass,
    canUpdateClass,
    model,
  } = req.body;
  const id = req.query.id;
  const user = await prisma[model].findUnique({ where: { id } });
  if (!user) {
    throw new BadRequestError(`${model} not found`);
  }
  const updatedUserAccess = {
    ...(canSeeUser && { canSeeUser }),
    ...(canAddUser && { canAddUser }),
    ...(canDeleteUser && { canDeleteUser }),
    ...(canUpdateUser && { canUpdateUser }),
    ...(canSeeTeacher && { canSeeTeacher }),
    ...(canAddTeacher && { canAddTeacher }),
    ...(canDeleteTeacher && { canDeleteTeacher }),
    ...(canUpdateTeacher && { canUpdateTeacher }),
    ...(canSeeStudent && { canSeeStudent }),
    ...(canAddStudent && { canAddStudent }),
    ...(canDeleteStudent && { canDeleteStudent }),
    ...(canUpdateStudent && { canUpdateStudent }),
    ...(canSeeClass && { canSeeClass }),
    ...(canAddClass && { canAddClass }),
    ...(canDeleteClass && { canDeleteClass }),
    ...(canUpdateClass && { canUpdateClass }),
  };
  const updatedUser = await prisma[model].update({
    where: { id },
    data: {
      [model]: updatedUserAccess,
    },
  });
  sendSuccess(res, {
    statusCode: 201,
    message: "User access modified Successfully",
    data: updatedUser,
  });
});
export const getUsersWithClasses = asyncWrapper(async (req, res) => {
  // Extract pagination parameters (defaults: page 1, 10 items per page)
  const {
    startDate,
    endDate,
    sortBy = "startTime",
    order = "asc",
    page = 1,
    user,
    limit = 11,
  } = req.query;
  if (!["teacher", "student"].includes(user)) {
    throw new BadRequestError(
      "Invalid user type. Must be 'teacher' or 'student'."
    );
  }
  const userClass = user === "teacher" ? "classes" : "bookedClasses";
  const { status } = req.params;
  const parsedPage = Math.max(1, parseInt(page));
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (parsedPage - 1) * parsedLimit;
  // Build the class filter from query if provided.
  // We assume the client sends a JSON string in ?filter=
  const classFilter = {};

  if (status !== "all-classes") classFilter.status = status;

  if (startDate || endDate) {
    classFilter.startTime = {};

    if (startDate) {
      classFilter.startTime.gte = new Date(`${startDate}T00:00:00.000Z`);
    }
    if (endDate) {
      classFilter.startTime.lte = new Date(`${endDate}T23:59:59.999Z`);
    }
  }

  console.log(classFilter);

  // Fetch teachers with pagination and include:
  // - classes (filtered by classFilter)
  const [users, totalUsers] = await Promise.all([
    prisma[user].findMany({
      skip,
      take: parsedLimit,

      select: {
        id: true,
        name: true,
        email: true,
        profilePicture: true,
        [userClass]: {
          where: { ...classFilter },
        },
        _count: {
          select: {
            [userClass]: {
              where: { ...classFilter },
            },
          },
        },
      },
    }),
    prisma[user].count(),
  ]);
  //

  // Calculate pagination metadata
  const from = skip + 1;
  const to = Math.min(skip + users.length, totalUsers);

  const metadata = {
    total: totalUsers,
    range: `${from} to ${to} of ${totalUsers}`,
    currentPage: page,
    pageSize: limit,
  };

  return sendSuccess(res, {
    statusCode: 200,
    message: `${user} fetched successfully!`,
    data: users,
    metadata,
  });
});
