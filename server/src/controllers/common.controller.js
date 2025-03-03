import { sendSuccess } from "../lib/api.response.js";
import prisma from "../Prisma/prisma.client.js";
import asyncWrapper from "../utils/asyncWrapper.js";
import _ from "lodash";
export const updatePassword = asyncWrapper(async (req, res) => {
  const { password, model } = req.body;
  const userId = req.user.userId;
  const updatedUser = await prisma[model].update({
    where: { id: userId },
    data: { password },
  });
  sendSuccess(res, {
    statusCode: 201,
    message: "Password updated Successfully",
    data: { [model]: _.omit(updatedUser, "passwordHash") || updatedUser },
  });
});
export const getCalendarClasses = asyncWrapper(async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ error: "Start date and end date are required" });
  }

  const filter = {
    scheduledAt: {
      gte: new Date(startDate),
      lte: new Date(endDate),
    },
  };

  // For teacher-specific calendar
  if (req.user.role === "TEACHER") {
    filter.teacherId = req.user.userId;
  }

  // For student-specific calendar
  if (req.user.role === "STUDENT") {
    filter.studentId = req.user.userId;
  }

  const classes = await prisma.class.findMany({
    where: filter,
    include: {
      teacher: {
        select: {
          id: true,
          email: true,
          name: true,
          profilePicture: true,
        },
      },
      student: {
        select: {
          id: true,
          email: true,
          name: true,
          profilePicture: true,
        },
      },
    },
    orderBy: {
      startTime: "asc",
    },
  });

  // Format data for calendar view
  const calendarData = classes.map((cls) => ({
    id: cls.id,
    title: cls.subject,
    date: cls.scheduledAt,
    start: cls.startTime,
    end: cls.endTime,
    status: cls.status,
    teacherName: cls.teacher.name,
    studentName: cls.student.name,
    teacherId: cls.teacherId,
    studentId: cls.studentId,
    classId: cls.classId,
  }));

  sendSuccess(res, {
    statusCode: 200,
    message: "Classes fetched successfully",
    data: { classCalenderData: calendarData },
  });
});
