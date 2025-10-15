
import prisma from "../../Prisma/prisma.client.js";
import {getPagination,buildPaginationMeta,asyncWrapper,controllerHelper,sendSuccess,BadRequestError,NotFoundError,comparePassword,hashPassword,generateToken} from "../../utils/index.js";
import _ from "lodash";
import { classUtil } from "../../services/class.services.js";
import config from "../../Config/config.js";
import { Role } from "../../constant.js";
// Register Teacher
export const registerTeacher = asyncWrapper(async (req, res) => {
  // Check if teacher already exists
  let teacher = await prisma.teacher.findUnique({
    where: { email: req.body.email },
  });
  if (teacher) {
    throw new BadRequestError("Email is already registered");
  }

  // Hash password
  const hashedPassword = await hashPassword(req.body.password);

  // Create teacher
  teacher = await prisma.teacher.create({
    data: {
      name: req.body.name,
      email: req.body.email,
      passwordHash: hashedPassword,
      profilePicture: req.body?.profilePicture || null,
      qualification: req.body.qualification,
      classRate: parseInt(req.body?.hourlyRate),
      role: Role.TEACHER,
    },
  });

  // ✅ Create default access control linked to the teacher
  await prisma.teacherAccessControl.create({
    data: {
      teacherId: teacher.id,
      canSeeClass: true,
      canAddClass: true,
      canUpdateClass: true,
      canDeleteClass: false,
      canSeeStudent: true,
      canAddStudent: false,
      canUpdateStudent: false,
      canDeleteStudent: false,
    },
  });

  // ✅ Send response
  sendSuccess(res, {
    statusCode: 201,
    message: "Teacher created successfully with default access control",
    data: _.omit(teacher, ["passwordHash"]),
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
    throw new BadRequestError("Invalid email or password");
  }

  // Generate JWT token
  const accessToken = generateToken(teacher);
  res.cookie("token", accessToken, {
    httpOnly: false,
    secure: config.isProduction, // Use secure in production
    sameSite: "strict",
    maxAge: parseInt(config.jwtSecretExpiry, 10), // Ensure maxAge is a number
  });
  sendSuccess(res, {
    statusCode: 200,
    message: "Login successful",
    data: {
       accessToken,
      user: _.pick(teacher, [
        "id",
        "name",
        "email",
        "role",
        "profilePicture",
      ])
    },
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
    data: _.omit(teacher, ["passwordHash"]) ,
  });
});
// Get Teacher Profile
export const getTeacher = asyncWrapper(async (req, res) => {
  const filter = {};
  let omit=['passwordHash'];
  if (req?.params.id) {
    filter.id = req.params.id;
  } else {
    filter.id = req.user.userId;
    omit.push('teacherAccessControl');
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
    data:  _.omit(teacher, omit),
  });
});
export const getAllTeacher = asyncWrapper(async (req, res) => {
  const { sortBy = "name", order = "asc" } = req.query;
  const teacherFilter = controllerHelper.buildFilter(req.user.role, req.query);
  const { skip, take,page,limit } = getPagination(req.query);
  const [teachers,totalTeachers] = await Promise.all([prisma.teacher.findMany({
    skip,
    take,
    orderBy: { [sortBy]: order },
    where: teacherFilter,
    select: {
      id: true,
      name: true,
      email: true,
      profilePicture: true,
      qualification: true,
      isEmailVerified: true,
    },
  }),prisma.teacher.count({
    where: teacherFilter,
  })]);
  const paginationData=buildPaginationMeta(totalTeachers,page,limit)
  console.log(paginationData)
  sendSuccess(res, {
    statusCode: 200,
    message: "Teachers fetched Successfully",
    data: teachers,
    pagination: paginationData,
  });
});

export const getTeachersForSelection = asyncWrapper(async (req, res) => {
  const { searchName  } = req.query;
  const { skip, take, page, limit } = getPagination(req.query);
  const filter = {
    ...(searchName && { name: { contains: searchName, mode: "insensitive" } }),
  };
  const [teachers, totalTeachers] = await  Promise.all([prisma.teacher.findMany({
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
  }),prisma.teacher.count({ where: filter })]);
  const paginationData = buildPaginationMeta(totalTeachers,page,limit)
  sendSuccess(res, {
    statusCode: 200,
    message: "Teachers fetched Successfully",
    data: teachers,
    pagination: paginationData,
  });
});
//
export const updateTeacherByAdmin = asyncWrapper(async (req, res) => {
  const { profilePicture, name, email, qualification, classRate, address } =
    req.body;
  const id = req.params.id;
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
  const check = await prisma.teacher.findUnique({ where: { id } });
  if (!check) {
    throw new BadRequestError("teacher not found");
  }
  if (email && !(email === check.email)) {
    const existTeacher = await prisma.teacher.findUnique({ where: { email } });
    if (existTeacher) {
      throw new BadRequestError("email already registered");
    }
  }
  const updatedTeacher = await prisma.teacher.update({ where: { id }, data });
  sendSuccess(res, {
    statusCode: 200,
    message: "teacher updated Successfully",
    data:  _.omit(updatedTeacher, ["passwordHash"]),
  });
});

export const deleteTeacherByAdmin = asyncWrapper(async (req, res) => {
  const id = String(req.params.id);

  // 1. Find teacher
  const teacher = await prisma.teacher.findUnique({ where: { id } });
  if (!teacher) {
    throw new BadRequestError("Teacher not found");
  }

  // 2. Check if teacher already soft-deleted
  if (teacher.isDeleted) {
    throw new BadRequestError("Teacher already deleted");
  }

  // 3. Prevent deletion if teacher has ongoing or scheduled classes
  const hasClasses = await prisma.class.count({
    where: {
      teacherId: id,
      status: { in: ["IN_PROGRESS", "SCHEDULED"] },
    },
  });

  if (hasClasses > 0) {
    throw new BadRequestError("Cannot delete teacher with ongoing or scheduled classes");
  }

  // 4. Soft delete teacher
  const updatedTeacher = await prisma.teacher.update({
    where: { id },
    data: { isDeleted: true },
  });

  // 5. Respond with success
  sendSuccess(res, {
    statusCode: 200,
    message: "Teacher deleted successfully",
    data: _.omit(updatedTeacher, ["passwordHash"]),
  });
});

export const patchTeacher = asyncWrapper(async (req, res) => {
  const id = req.user.userId;
  const data = req.body;
  if (Object.keys(data).length !== 1) {
    throw new BadRequestError("Only one field can be updated at a time.");
  }
  if (data.email) {
    const existTeacher = await prisma.teacher.findUnique({ where: { email: data.email } });
    if (existTeacher) {
      throw new BadRequestError("email is already registered");
    }
  }
  const check = await prisma.teacher.findUnique({ where: { id } });
  if (!check) {
    throw new NotFoundError("teacher not found");
  }
  const teacher = await prisma.teacher.update({
    where: { id },
    data,
  });
  sendSuccess(res, {
    statusCode: 200,
    message: "Teacher field updated successfully",
    data: _.omit(teacher, ["passwordHash"]),
  });
});
////////////////////////////////////////////////
//////////////////class////////////////////////
/////////////////////////////////////////////////
/**
 * Get teachers with their class count
 * @route GET /api/teacher/class-count
 */
export const getTeachersWithClassCount = asyncWrapper(async (req, res) => {
  // Extract pagination parameters
  const { page, limit, take, skip } = getPagination(req.query);
  
  // Build class filter from query parameters
  const classFilter = classUtil.buildClassFilters(req.query);
  
  // Fetch teachers with pagination and include class count
  const [teachers, totalTeachers] = await Promise.all([
    prisma.teacher.findMany({
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
    prisma.teacher.count(),
  ]);

  // Calculate pagination metadata
  const paginationData = buildPaginationMeta(totalTeachers,page,limit)

  // Response
  return sendSuccess(res, {
    statusCode: 200,
    message: "Teachers with class count fetched successfully",
    data: teachers,
    pagination: paginationData,
  });
});

/**
 * Get teachers with their associated classes
 * @route GET /api/teacher/classes
 */
export const getTeachersWithClasses = asyncWrapper(async (req, res) => {
  // Extract pagination parameters
  const { page, limit, take, skip } = getPagination(req.query);
  
  // Build class filter from query parameters
  const classFilter = classUtil.buildClassFilters(req.query);
  
  // Fetch teachers with pagination and include classes
  const [teachers, totalTeachers] = await Promise.all([
    prisma.teacher.findMany({
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
    prisma.teacher.count(),
  ]);

  // Calculate pagination metadata
  const paginationData = buildPaginationMeta(totalTeachers,page,limit)

  // Response
  return sendSuccess(res, {
    statusCode: 200,
    message: "Teachers with classes fetched successfully",
    data: teachers,
    pagination: paginationData,
  });
});
/** 
* Get class count for first 11 teachers on a specific day
* @route GET /api/teacher/class-day-count
*/
export const getTeacherClassCountForDay = asyncWrapper(async (req, res) => {
  const { date } = req.query;
  const { skip, take, page, limit } = getPagination(req.query);
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
  const paginationData = buildPaginationMeta(totalTeachers,page,limit)
  sendSuccess(res, {
    statusCode: 200,
    message: "Teacher class count fetched successfully",
    data: formattedResult,
    pagination: paginationData,
  });
});
////////////////////////////////////////////////
//////////////////access control////////////////////////
/////////////////////////////////////////////////
export const modifyTeacherAccess = asyncWrapper(async (req, res) => {
  const id = req.params.id;

  // 1️⃣ Find teacher
  const teacher = await prisma.teacher.findUnique({ where: { id } });
  if (!teacher) {
    throw new BadRequestError("Teacher not found");
  }

  // 2️⃣ Extract permission fields (teacher relevant)
  const {
    canSeeClass,
    canAddClass,
    canUpdateClass,
    canDeleteClass,
    canSeeStudent,
    canAddStudent,
    canUpdateStudent,
    canDeleteStudent,
  } = req.body;

  // 3️⃣ Build update object (ignore undefined)
  const updatedAccess = {
    ...(canSeeClass !== undefined && { canSeeClass }),
    ...(canAddClass !== undefined && { canAddClass }),
    ...(canUpdateClass !== undefined && { canUpdateClass }),
    ...(canDeleteClass !== undefined && { canDeleteClass }),
    ...(canSeeStudent !== undefined && { canSeeStudent }),
    ...(canAddStudent !== undefined && { canAddStudent }),
    ...(canUpdateStudent !== undefined && { canUpdateStudent }),
    ...(canDeleteStudent !== undefined && { canDeleteStudent }),
  };

  // 4️⃣ Ensure access control record exists
  let access = await prisma.teacherAccessControl.findUnique({
    where: { teacherId: id },
  });

  if (!access) {
    access = await prisma.teacherAccessControl.create({
      data: { teacherId: id, ...updatedAccess },
    });
  } else {
    access = await prisma.teacherAccessControl.update({
      where: { id: access.id },
      data: updatedAccess,
    });
  }

  // 5️⃣ Return updated teacher with access
  const updatedTeacher = await prisma.teacher.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      profilePicture: true,
      qualification: true,
      teacherAccessControl: true,
    },
  });

  sendSuccess(res, {
    statusCode: 200,
    message: "Teacher access modified successfully",
    data: _.omit(updatedTeacher, ["passwordHash"]),
  });
});
