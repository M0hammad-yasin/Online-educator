import { sendSuccess } from "../../Lib/api.response.js";
import { BadRequestError, NotFoundError } from "../../Lib/custom.error.js";
import prisma from "../../Prisma/prisma.client.js";
import asyncWrapper from "../../Utils/asyncWrapper.js";
import { hashPassword, comparePassword } from "../../Utils/bcrypt.js";
import { generateToken } from "../../Utils/jwt.user.js";
import { format } from "date-fns";
import pagination from "../../Utils/pagination.js";
import _ from "lodash";
import { classUtil } from "../../Services/class.services.js";
import { controllerHelper } from "../../Utils/controller.helper.js";
// Register Teacher
export const registerTeacher = asyncWrapper(async (req, res) => {
  // Check if teacher already exists
  let teacher = await prisma.teacher.findUnique({
    where: { email: req.body.email },
  });
  if (teacher) {
    throw new BadRequestError("Email is already registered");
  }
  // Hash Password
  const hashedPassword = await hashPassword(req.body.password);

  teacher = await prisma.teacher.create({
    data: {
      name: req.body.name,
      email: req.body.email,
      passwordHash: hashedPassword,
      profilePicture: req.body?.profilePicture || null,
      qualification: req.body.qualification,
      classRate: parseInt(req.body?.hourlyRate),
      role: "TEACHER",
    },
  });
  sendSuccess(res, {
    statusCode: 201,
    message: "Teacher created successfully",
    data: { teacher: _.omit(teacher, ["passwordHash"]) },
  });
});

// Teacher Login
export const loginTeacher = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  // Check if teacher exists
  const teacher = await prisma.teacher.findUnique({ where: { email } });
  if (!teacher) {
    throw new NotFoundError("Email is not registered");
  }

  // Compare password
  const isMatch = await comparePassword(password, teacher.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Generate JWT token
  const token = generateToken(teacher);
  sendSuccess(res, {
    statusCode: 200,
    message: "Login successful",
    data: { token },
  });
});
export const logoutTeacher = asyncWrapper(async (req, res) => {
  res.clearCookie("token");
  sendSuccess(res, {
    statusCode: 200,
    message: "Logout successful",
    data: null,
  });
});
// Update Teacher Profile
export const updateTeacher = asyncWrapper(async (req, res) => {
  const { profilePicture, name, email, qualification, classRate, address } =
    req.body;
  const id = req.user.userId;
  const check = await prisma.teacher.findUnique({ where: { id } });
  if (!check) {
    throw new NotFoundError("teacher not found");
  }
  if (email) {
    const existTeacher = await prisma.teacher.findUnique({ where: { email } });
    if (existTeacher) {
      throw new BadRequestError("email is already registered");
    }
  }
  const data = {
    ...(profilePicture && { profilePicture }),
    ...(name && { name }),
    ...(email && { email }),
    ...(qualification && { qualification }),
    ...(classRate && { classRate }),
    ...(address && { address }),
  };

  if (Object.keys(data).length === 0) {
    throw new BadRequestError("No data to update");
  }

  const teacher = await prisma.teacher.update({ where: { id }, data });
  sendSuccess(res, {
    statusCode: 200,
    message: "Teacher updated Successfully",
    data: { updatedTeacher: _.omit(teacher, ["passwordHash"]) },
  });
});
// Get Teacher Profile
export const getTeacher = asyncWrapper(async (req, res) => {
  const filter = {};
  if (req?.params.id) {
    filter.id = req.params.id;
  } else {
    filter.id = req.user.userId;
  }
  const teacher = await prisma.teacher.findUnique({
    where: filter,
  });

  if (!teacher) {
    throw new NotFoundError("Teacher not found");
  }
  sendSuccess(res, {
    statusCode: 200,
    message: "Teacher found Successfully",
    data: { teacher: _.omit(teacher, ["passwordHash"]) },
  });
});
export const getAllTeacher = asyncWrapper(async (req, res) => {
  const { sortBy = "name", order = "asc" } = req.query;
  const classFilter = classUtil.buildClassFilters(req.query);
  const teacherFilter = controllerHelper.buildFilter(req.user.role, req.query);
  const { skip, take } = pagination(req.query);
  const teachers = await prisma.teacher.findMany({
    skip,
    take,
    orderBy: { [sortBy]: order },
    where: {
      AND: [
        teacherFilter,
        {
          classes: {
            some: classFilter,
          },
        },
      ],
    },
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

export const getTeachersForSelection = asyncWrapper(async (req, res) => {
  const { searchName = "" } = req.query;
  const { skip, take, page, limit } = pagination(req.query);
  const filter = {
    ...(searchName && { name: { contains: searchName, mode: "insensitive" } }),
  };
  const teachers = await prisma.teacher.findMany({
    skip,
    take,
    orderBy: { ["name"]: "asc" },
    where: filter,
    select: {
      id: true,
      name: true,
      email: true,
      profilePicture: true,
      qualification: true,
    },
  });
  const paginationData = {
    page,
    totalTeacher: limit,
  };
  sendSuccess(res, {
    statusCode: 200,
    message: "Teachers fetched Successfully",
    data: { teachers },
    metaData: {
      filter: req.query,
      paginationData,
    },
  });
});

// Get class count for first 11 teachers on a specific day
export const getTeacherClassCountForDay = asyncWrapper(async (req, res) => {
  const { date } = req.query;
  const { skip, take, page, limit } = pagination(req.query);
  if (!date) throw new BadRequestError("Invalid date");
  const targetDate = new Date(date);
  const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

  const [teacherClassCounts, totalTeachers] = await Promise.all([
    prisma.teacher.findMany({
      take,
      skip,
      orderBy: { id: "asc" },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            classes: {
              where: {
                startTime: {
                  gte: startOfDay,
                  lte: endOfDay,
                },
              },
            },
          },
        },
      },
    }),
    prisma.teacher.count(),
  ]);

  const formattedResult = teacherClassCounts.map((teacher) => ({
    teacherName: teacher.name,
    classCount: teacher._count.classes,
  }));
  const paginationData = {
    total: teacherClassCounts.length,
    range: `${from} to ${to} of ${totalTeachers}`,
    currentPage: page,
    pageSize: limit,
  };
  sendSuccess(res, {
    statusCode: 200,
    message: "Teacher class count fetched successfully",
    data: { teacherClassCounts: formattedResult },
    metadata: {
      paginationData,
      filter: {
        date: format(targetDate, "MMMM d, yyyy"),
      },
    },
  });
});
