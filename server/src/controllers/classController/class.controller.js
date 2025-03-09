import { format } from "date-fns";
import { sendSuccess } from "../../lib/api.response.js";
import prisma from "../../Prisma/prisma.client.js";
import asyncWrapper from "../../utils/asyncWrapper.js";
import { AuthorizationError } from "../../lib/custom.error.js";

export const getClassesGroupedCount = asyncWrapper(async (req, res) => {
  // Extract pagination parameters (defaults: page 1, 10 items per page)
  const {
    startDate,
    endDate,
    sortBy = "startTime",
    order = "asc",
    page = 1,
    status,
    groupBy,
    limit = 10,
  } = req.query;
  let teacherId = null,
    studentId = null;
  if (req.user.role === "ADMIN" || req.user.role === "MODERATOR") {
    studentId = teacherId = null;
  } else if (req.user.role === "TEACHER") {
    teacherId = req.user.userId;
    studentId = null;
  } else if (req.user.role === "STUDENT") {
    studentId = req.user.userId;
    teacherId = null;
  }
  const parsedPage = Math.max(1, parseInt(page));
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (parsedPage - 1) * parsedLimit;
  // Build the class filter from query if provided.
  // We assume the client sends a JSON string in ?filter=
  const classFilter = {
    ...(teacherId && { teacherId }),
    ...(studentId && { studentId }),
  };
  if (startDate || endDate) {
    classFilter.startTime = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  }
  if (status) {
    classFilter.status = status;
  }

  const [classes, totalClasses] = await Promise.all([
    prisma.class.findMany({
      where: classFilter,
      skip,
      take: parsedLimit,
      orderBy: {
        [sortBy]: order,
      },
      select: {
        id: true,
        scheduledAt: true,
        student: {
          select: {
            id: true,

            grade: true,
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
  let groupedDataCount = null;
  function gradeToOrdinal(n) {
    const j = n % 10,
      k = n % 100;
    if (j === 1 && k !== 11) {
      return n + "st";
    }
    if (j === 2 && k !== 12) {
      return n + "nd";
    }
    if (j === 3 && k !== 13) {
      return n + "rd";
    }
    return n + "th";
  }
  if (groupBy) groupedDataCount = classes;
  if (groupBy === "grade") {
    // Group classes by grade and count them
    groupedDataCount = classes.reduce((acc, cls) => {
      const grade = gradeToOrdinal(cls.student.grade);

      if (!acc[grade]) {
        acc[grade] = [{ classCount: 0 }];
      }

      acc[grade][0].classCount++;
      return acc;
    }, {});
  } else if (groupBy) {
    const groupKeyFormat =
      groupBy.toLowerCase() === "day"
        ? "yyyy-MM-dd"
        : groupBy.toLowerCase() === "hour"
        ? "yyyy-MM-dd HH:00"
        : "yyyy-MM"; // for "month"

    groupedDataCount = classes.reduce((acc, cls) => {
      // Use scheduledAt for grouping. We are formatting it but not reducing the original field.
      const groupKey = format(new Date(cls.scheduledAt), groupKeyFormat);
      if (!acc[groupKey]) {
        acc[groupKey] = [{ classCount: 0 }];
      }
      acc[groupKey][0].classCount++;
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
    data: {
      ...(groupBy
        ? { groupClassCount: groupedDataCount }
        : { classCount: classes }),
    },
    metadata,
  });
});
