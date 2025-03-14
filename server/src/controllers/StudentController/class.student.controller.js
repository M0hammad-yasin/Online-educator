import { format } from "date-fns";
import prisma from "../../Prisma/prisma.client.js";
import asyncWrapper from "../../Utils/asyncWrapper.js";

export const getGroupedClasses = asyncWrapper(async (req, res) => {
  // Extract pagination parameters (defaults: page 1, 10 items per page)
  const {
    startDate,
    endDate,
    sortBy = "startTime",
    order = "asc",
    page = 1,
    classStatus,
    groupBy,
    limit = 10,
  } = req.query;
  const parsedPage = Math.max(1, parseInt(page));
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (parsedPage - 1) * parsedLimit;
  // Build the class filter from query if provided.
  // We assume the client sends a JSON string in ?filter=
  const classFilter = {};
  if (startDate || endDate) {
    classFilter.startDate = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  }
  if (classStatus) {
    classFilter.status = classStatus;
  }
  classFilter.studentId = req.user.id;

  const [classes, totalClasses] = await Promise.all([
    prisma.class.findMany({
      where: classFilter,
      skip,
      take: parsedLimit,
      orderBy: {
        [sortBy]: order,
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePicture: true,
          },
        },
      },
    }),
    prisma.class.count({
      where: classFilter,
    }),
  ]);
  if (!classes) {
    throw new NotFoundError("No classes found");
  }
  //grouping
  const validGroupBys = ["day", "hour", "month"];
  let groupedData = null;
  if (groupBy) groupedData = classes;
  if (groupBy && validGroupBys.includes(groupBy.toLowerCase())) {
    const groupKeyFormat =
      groupBy.toLowerCase() === "day"
        ? "yyyy-MM-dd"
        : groupBy.toLowerCase() === "hour"
        ? "yyyy-MM-dd HH:00"
        : "yyyy-MM"; // for "month"

    groupedData = classes.reduce((acc, cls) => {
      // Use scheduledAt for grouping. We are formatting it but not reducing the original field.
      const groupKey = format(new Date(cls.scheduledAt), groupKeyFormat);
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(cls);
      return acc;
    }, {});
  }

  const from = skip + 1;
  const to = Math.min(skip + classes.length, totalClasses);

  const metadata = {
    total: classes.length,
    range: `${from} to ${to} of ${totalClasses}`,
    currentPage: page,
    pageSize: limit,
    ...(groupBy && { groupBy }),
  };
  sendSuccess(res, {
    statusCode: 200,
    message: "class fetched successfully",
    data: { ...(groupBy ? { groupedClassData } : { classes }) },
    metadata,
  });
});
