import prisma from "../../Prisma/prisma.client.js";
import {getPagination,buildPaginationMeta,sendSuccess,BadRequestError,asyncWrapper} from "../../utils/index.js";

export const modifyModeratorAccess = asyncWrapper(async (req, res) => {
  const id = req.params.id;

  // 1️⃣ Find moderator
  const moderator = await prisma.moderator.findUnique({ where: { id } });
  if (!moderator) {
    throw new BadRequestError("Moderator not found");
  }

  // 2️⃣ Extract permissions (moderator relevant)
  const {
    canSeeUser,
    canAddUser,
    canUpdateUser,
    canDeleteUser,
    canSeeTeacher,
    canAddTeacher,
    canUpdateTeacher,
    canDeleteTeacher,
    canSeeStudent,
    canAddStudent,
    canUpdateStudent,
    canDeleteStudent,
    canSeeClass,
    canAddClass,
    canUpdateClass,
    canDeleteClass,
  } = req.body;

  // 3️⃣ Build update object (ignore undefined)
  const updatedAccess = {
    ...(canSeeUser !== undefined && { canSeeUser }),
    ...(canAddUser !== undefined && { canAddUser }),
    ...(canUpdateUser !== undefined && { canUpdateUser }),
    ...(canDeleteUser !== undefined && { canDeleteUser }),
    ...(canSeeTeacher !== undefined && { canSeeTeacher }),
    ...(canAddTeacher !== undefined && { canAddTeacher }),
    ...(canUpdateTeacher !== undefined && { canUpdateTeacher }),
    ...(canDeleteTeacher !== undefined && { canDeleteTeacher }),
    ...(canSeeStudent !== undefined && { canSeeStudent }),
    ...(canAddStudent !== undefined && { canAddStudent }),
    ...(canUpdateStudent !== undefined && { canUpdateStudent }),
    ...(canDeleteStudent !== undefined && { canDeleteStudent }),
    ...(canSeeClass !== undefined && { canSeeClass }),
    ...(canAddClass !== undefined && { canAddClass }),
    ...(canUpdateClass !== undefined && { canUpdateClass }),
    ...(canDeleteClass !== undefined && { canDeleteClass }),
  };

  // 4️⃣ Ensure access control record exists
  let access = await prisma.moderatorAccessControl.findUnique({
    where: { moderatorId: id },
  });

  if (!access) {
    access = await prisma.moderatorAccessControl.create({
      data: { moderatorId: id, ...updatedAccess },
    });
  } else {
    access = await prisma.moderatorAccessControl.update({
      where: { id: access.id },
      data: updatedAccess,
    });
  }

  // 5️⃣ Return updated moderator with access
  const updatedModerator = await prisma.moderator.findUnique({
    where: { id },
    include: { moderatorAccessControl: true },
  });

  sendSuccess(res, {
    statusCode: 200,
    message: "Moderator access modified successfully",
    data: updatedModerator,
  });
});


//get all teachers or students with their classes
export const getUsersWithClasses = asyncWrapper(async (req, res) => {
  // Extract pagination parameters (defaults: page 1, 10 items per page)
  const {
    startDate,
    endDate,
    sortBy = "name",
    order = "asc",
    user,
    classStatus = "all-classes",
  } = req.query;

  if (!["teacher", "student"].includes(user)) {
    throw new BadRequestError(
      "Invalid user type. Must be 'teacher' or 'student'."
    );
  }
  const userClass = "classes";
  const { page, limit, take, skip } = getPagination(req.query);
  // Build the class filter from query if provided.
  // We assume the client sends a JSON string in ?filter=
  const classFilter = {};

  if (classStatus !== "all-classes") classFilter.status = classStatus;

  if (startDate || endDate) {
    classFilter.startTime = {};

    if (startDate) {
      classFilter.startTime.gte = new Date(`${startDate}T00:00:00.000Z`);
    }
    if (endDate) {
      classFilter.startTime.lte = new Date(`${endDate}T23:59:59.999Z`);
    }
  }

  // Fetch teachers with pagination and include:
  // - classes (filtered by classFilter)
  const [users, totalUsers] = await Promise.all([
    prisma[user].findMany({
      skip,
      take,
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
  const paginationData =buildPaginationMeta(totalUsers, page, limit );

  return sendSuccess(res, {
    statusCode: 200,
    message: `${user}s fetched successfully!`,
    data: users,
    pagination: paginationData,
  });
});
