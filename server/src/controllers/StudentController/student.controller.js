import {asyncWrapper,controllerHelper, getPagination,buildPaginationMeta,sendSuccess,BadRequestError,NotFoundError,comparePassword,hashPassword,generateToken} from "../../utils/index.js";
import prisma from "../../Prisma/prisma.client.js";
import _ from "lodash";
import { Role } from "../../constant.js";
import config from "../../Config/config.js";
import { classUtil } from "../../Services/class.services.js";
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
    data: student ,
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
    message: "Student updated Successfully",
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
    data:  _.omit(student, ["passwordHash"]),
  });
});
export const getAllStudent = asyncWrapper(async (req, res) => {
  const { sortBy = "name", order = "asc" } = req.query;

  // Build filters
  const classFilter = classUtil.buildClassFilters(req.query);
  const studentFilter = controllerHelper.buildFilter(req.user.role, req.query);
  const { skip, take, limit, page } = getPagination(req.query);

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
  const paginationData =buildPaginationMeta(total, page, limit );

  // Response
  sendSuccess(res, {
    statusCode: 200,
    message: "Students fetched successfully",
    data: students,
    pagination: paginationData,
  });
});


export const getStudentsForSelection = asyncWrapper(async (req, res) => {
  const { searchName = "" } = req.query;
  const { skip, take, page, limit } = getPagination(req.query);
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
  const paginationData = buildPaginationMeta(students.length, page, limit );

  sendSuccess(res, {
    statusCode: 200,
    message: "Students fetched Successfully",
    data: students,
    pagination: paginationData,
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
    message: "Student updated Successfully",
    data: { updateStudent: _.omit(student, ["passwordHash"]) },
  });
});

export const deleteStudentByAdmin = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const student = await prisma.student.findUnique({ where: { id } });
  if (!student) {
    throw new BadRequestError("student not found");
  }
  if(student.isDeleted) {
    throw new BadRequestError("student already deleted");
  }
  const hasClasses = await prisma.class.count({ where: { studentId: id,status: {in: ["IN_PROGRESS", "SCHEDULED"] } } });
  if (hasClasses > 0) {
    throw new BadRequestError("Cannot delete student with ongoing or scheduled classes");
  }
  const updatedStudent = await prisma.student.update({
      where: { id },
    data: { isDeleted: true },
  });
  sendSuccess(res, {
    statusCode: 201,
    message: "student deleted Successfully",
    data:  _.omit(updatedStudent, ["passwordHash"]) ,
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

// Search Students
export const searchStudents = asyncWrapper(async (req, res) => {
  const { search, limit = 10 } = req.query;
  const filter = {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { parentEmail: { contains: search, mode: "insensitive" } },
        ],
      };
  const students = await prisma.student.findMany({
    where: filter,
    take: parseInt(limit),
    select: {
      id: true,
      name: true,
      email: true,
      profilePicture: true,
      grade: true,
      parentEmail: true,
    },
    orderBy: { name: "asc" },
  });

  sendSuccess(res, {
    statusCode: 200,
    message: "Students search results",
    data: students,
  });
});
/////////////////////////////////////////////////////////
////////////////////student with classes//////////////////
/////////////////////////////////////////////////////////
/**
 * Get students with their class count
 * @route GET /api/admin/students/class-count
 */
export const getStudentsWithClassCount = asyncWrapper(async (req, res) => {
  // Extract pagination parameters
  const { page, limit, take, skip } = getPagination(req.query);
  
  // Build class filter from query parameters
  const classFilter = classUtil.buildClassFilters(req.query);
  // Fetch students with pagination and include class count
  const [students, totalStudents] = await Promise.all([
    prisma.student.findMany({
      skip,
      take,
      select: {
        id: true,
        name: true,
        email: true,
        profilePicture: true,
        _count: {
          select: {
            classes: {
              where: { ...classFilter },
            },
          },
        },
      },
    }),
    prisma.student.count(),
  ]);

  // Calculate pagination metadata
  const paginationData = buildPaginationMeta(totalStudents, page, limit );
      // Response
  return sendSuccess(res, {
    statusCode: 200,
    message: "Students with class count fetched successfully",
    data: students,
    pagination: paginationData,
  });
});

/**
 * Get students with their associated classes
 * @route GET /api/admin/student/classes
 */
export const getStudentsWithClasses = asyncWrapper(async (req, res) => {
  // Extract pagination parameters
  const { page, limit, take, skip } = getPagination(req.query);
  
  // Build class filter from query parameters
  const classFilter = classUtil.buildClassFilters(req.query);
  
  // Fetch students with pagination and include classes
  const [students, totalStudents] = await Promise.all([
    prisma.student.findMany({
      skip,
      take,
      select: {
        id: true,
        name: true,
        email: true,
        profilePicture: true,
        classes: {
          where: { ...classFilter },
        },
      },
    }),
    prisma.student.count(),
  ]);

  // Calculate pagination metadata
  const paginationData = buildPaginationMeta(totalStudents, page, limit );
    // Response with standardized format
  return sendSuccess(res, {
    statusCode: 200,
    message: "Students with classes fetched successfully",
    data: students,
    pagination: paginationData,
  });
});