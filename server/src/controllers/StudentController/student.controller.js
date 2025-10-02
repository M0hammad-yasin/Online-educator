import asyncWrapper from "../../Utils/asyncWrapper.js";
import { comparePassword, hashPassword } from "../../Utils/bcrypt.js";
import { generateToken } from "../../Utils/jwt.user.js";
import prisma from "../../Prisma/prisma.client.js";
import _ from "lodash";
import { Role } from "../../constant.js";
import { BadRequestError, NotFoundError } from "../../Lib/custom.error.js";
import { sendSuccess } from "../../Lib/api.response.js";
import config from "../../Config/config.js";
import { classUtil } from "../../services/class.services.js";
import { controllerHelper } from "../../Utils/controller.helper.js";
import pagination from "../../Utils/pagination.js";
// Register Student
export const registerStudent = asyncWrapper(async (req, res) => {
  // Hash Password
  const hashedPassword = await hashPassword(req.body.password);
  const existingStudent = await prisma.student.findUnique({
    where: { email: req.body.email },
  });
  if (existingStudent) {
    throw new BadRequestError("email already registered");
  }
  const student = await prisma.student.create({
    data: {
      name: req.body.name,
      grade: req.body.grade,
      email: req.body.email,
      passwordHash: hashedPassword,
      parentEmail: req.body?.parentEmail,
      profilePicture: req.body?.profilePicture,
      role: Role.STUDENT,
    },
  });

  sendSuccess(res, {
    statusCode: 201,
    message: "Student registered successfully",
    data: { student },
  });
});
export const updateStudent = asyncWrapper(async (req, res) => {
  const { profilePicture, name, email, parentEmail, grade, address, region } =
    req.body;
  const id = req.user.userId;
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
// Student Login
export const loginStudent = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;

  // Check if student exists
  const student = await prisma.student.findUnique({ where: { email } });
  if (!student) {
    throw new NotFoundError("email is not registered");
  }

  // Compare password
  const isMatch = await comparePassword(password, student.passwordHash);
  if (!isMatch) {
    throw new BadRequestError("Invalid password");
  }
  // Generate JWT token
  const accessToken = generateToken(student);
  res.cookie("token", accessToken, {
    httpOnly: true,
    secure: config.isProduction, // Use secure in production
    sameSite: "strict",
  });
  sendSuccess(res, {
    statusCode: 200,
    message: "Login successful",
    data: {
      accessToken,
      user: _.pick(student, [
        "id",
        "name",
        "email",
        "role",
        "profilePicture",
      ])
    },
  });
});
export const logoutStudent = asyncWrapper(async (req, res) => {
  res.clearCookie("token");
  sendSuccess(res, {
    statusCode: 200,
    message: "Logout successful",
    data: null,
  });
});
// Get Student Profile
export const getStudent = asyncWrapper(async (req, res) => {
  let filter = { id: req?.params.id };
  if (req.user.role == Role.STUDENT) filter = { id: req.user.userId };
  const student = await prisma.student.findUnique({
    where: filter,
  });

  if (!student) {
    throw new NotFoundError("Student not found");
  }

  sendSuccess(res, {
    statusCode: 200,
    message: "Student fetched Successfully",
    data: { user: _(student).omit(["passwordHash"]) },
  });
});
export const getAllStudent = asyncWrapper(async (req, res) => {
  const { sortBy = "name", order = "asc" } = req.query;

  // Build filters
  const classFilter = classUtil.buildClassFilters(req.query);
  const studentFilter = controllerHelper.buildFilter(req.user.role, req.query);
  const { skip, take, limit, page } = pagination(req.query);

  // Build where clause (combine student + class filters if needed)
  const whereClause =
    Object.keys(classFilter).length > 0
      ? {
          AND: [
            studentFilter,
            { classes: { some: classFilter } },
          ],
        }
      : studentFilter;

  // Fetch students
  const [students, total] = await Promise.all([
    prisma.student.findMany({
      skip,
      take,
      orderBy: { [sortBy]: order },
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        profilePicture: true,
        grade: true,
        region: true,
        parentEmail: true,
        address: true,
        createdAt: true,
        updatedAt: true,
        classes: true,
      },
    }),
    prisma.student.count({ where: whereClause }),
  ]);

  // Pagination object
  const paginationData = {
    page,
    limit,
    totalItems: total,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page * limit < total,
    hasPrevPage: page > 1,
  };

  // Response
  sendSuccess(res, {
    statusCode: 200,
    message: "Students fetched successfully",
    data: {  students, pagination: paginationData },
  });
});


export const getStudentsForSelection = asyncWrapper(async (req, res) => {
  const { searchName = "" } = req.query;
  const { skip, take, page, limit } = pagination(req.query);
  const filter = {
    ...(searchName && { name: { contains: searchName, mode: "insensitive" } }),
  };
  const students = await prisma.student.findMany({
    skip,
    take,
    where: filter,
    select: {
      id: true,
      name: true,
      email: true,
      profilePicture: true,
      grade: true,
    },
  });
  const paginationData = {
    page,
    totalTeacher: limit,
  };

  sendSuccess(res, {
    statusCode: 200,
    message: "Teachers fetched Successfully",
    data: { students },
    metaData: {
      filter: req.query,
      paginationData,
    },
  });
});
export const updateStudentByAdmin = asyncWrapper(async (req, res) => {
  const { profilePicture, name, email, parentEmail, grade, address, region } =
    req.body;
  const id = req.params.id;
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
    data: { updateStudent: _.omit(student, ["passwordHash"]) },
  });
});

export const deleteStudentByAdmin = asyncWrapper(async (req, res) => {
  const { id } = req.params;
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
    data:  _.omit(delStudent, ["passwordHash"]) ,
  });
});

export const patchStudent = asyncWrapper(async (req, res) => {
  const id = req.user.userId;
  const data = req.body;
  if (Object.keys(data).length !== 1) {
    throw new BadRequestError("Only one field can be updated at a time.");
  }
  if (data.email) {
    const existingStudent = await prisma.student.findUnique({ where: { email: data.email } });
    if (existingStudent) {
      throw new BadRequestError("email already registered");
    }
  }
  const check = await prisma.student.findUnique({ where: { id } });
  if (!check) {
    throw new BadRequestError("student doesn't exist");
  }
  const student = await prisma.student.update({
    where: { id },
    data,
  });
  sendSuccess(res, {
    statusCode: 200,
    message: "Student field updated successfully",
    data: _.omit(student, ["passwordHash"]),
  });
});
