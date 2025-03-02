import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../../lib/custom.error.js";
import { format, isAfter, isDate, isBefore, isEqual } from "date-fns";
import asyncWrapper from "../../utils/asyncWrapper.js";
import { generateClassId, getDuration } from "../Helper/class.helper.js";
import checkClassConflicts from "../Helper/checkConfliction.js";
import { sendSuccess } from "../../lib/api.response.js";
import prisma from "../../Prisma/prisma.client.js";
import e from "express";
// Create class (to be used with different middlewares)
export const createClass = asyncWrapper(async (req, res) => {
  let {
    subject,
    duration,
    scheduledAt,
    startTime,
    endTime,
    classLink,
    studentId,
    teacherId,
  } = req.body;
  // Check student exists (could be middleware)

  if (!startTime) {
    startTime = new Date(scheduledAt);
  }
  if (!endTime) {
    scheduledAt = new Date(scheduledAt);
    endTime = new Date(scheduledAt.getTime() + duration * 60000);
  }
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) throw new NotFoundError("Student not found");
  const teacher = await prisma.teacher.findUnique({ where: { id: teacherId } });
  if (!teacher) throw new NotFoundError("Teacher not found");
  // Check scheduling conflicts (business logic remains in controller)
  const [teacherConflict, studentConflict] = await Promise.all([
    checkClassConflicts(teacherId, "teacherId", startTime, endTime),
    checkClassConflicts(studentId, "studentId", startTime, endTime),
  ]);
  if (teacherConflict) {
    throw new ConflictError(
      `Teacher is already scheduled at ${scheduledAt} for ${duration} minutes`
    );
  } else if (studentConflict) {
    throw new ConflictError(`stucdent is already scheduled at ${scheduledAt}`);
  }
  const classId = generateClassId(student.grade, subject);

  const newClass = await prisma.class.create({
    data: {
      subject,
      classId,
      ...(classLink && { classLink }),
      scheduledAt: new Date(scheduledAt),
      teacherId,
      studentId,
      startTime,
      endTime,
      duration,
    },
  });

  //   export const sendSuccess = (res, options = {}) => {
  //     const {
  //       statusCode = 200,
  //       message = "Operation successful",
  //       data = null,
  //       metadata = null,
  //     } = options;

  //     const response = {
  //       status: "success",
  //       message,
  //     };

  //     if (data) response.data = data;
  //     if (metadata) response.metadata = metadata;

  //     return res.status(statusCode).json(response);
  //   };
  sendSuccess(res, {
    statusCode: 201,
    message: "class created Successfully",
    data: newClass,
  });
});

export const updateClass = asyncWrapper(async (req, res) => {
  let {
    subject,
    duration,
    scheduledAt,
    startTime,
    endTime,
    classLink,
    studentId,
    teacherId,
    status,
    title,
  } = req.body;
  const { id } = req.query;
  // Find the class
  const classData = await prisma.class.findUnique({
    where: { id },
  });

  if (!classData) throw new NotFoundError("Class not found");
  if (!startTime) startTime = classData.startTime;
  if (!endTime) endTime = classData.endTime;
  const studentIdStr = studentId?.toString();
  const teacherIdStr = teacherId?.toString();

  if (studentIdStr?.length === 24) {
    await prisma.student.findUnique({
      where: { id: studentIdStr },
    });

    // Check student scheduling conflict
    await checkClassConflicts(
      studentIdStr,
      "studentId",
      startTime,
      endTime,
      id
    );
  }

  if (teacherIdStr?.length === 24) {
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherIdStr },
    });
    if (!teacher) throw new NotFoundError("Teacher not found");

    // Check teacher scheduling conflict
    await checkClassConflicts(
      teacherIdStr,
      "teacherId",
      startTime,
      endTime,
      id
    );
  }

  const updateData = {
    ...(classLink && { classLink }),
    ...(studentIdStr && { studentId: studentIdStr }),
    ...(teacherIdStr && { teacherId: teacherIdStr }),
    ...(scheduledAt && { scheduledAt: new Date(scheduledAt) }),
    ...(startTime && { startTime: new Date(startTime) }),
    ...(endTime && { endTime: new Date(endTime) }),
    ...(duration && { duration }),
    ...(subject && { subject }),
    ...(status && { status }),
    ...(title && { title }),
  };
  // if (title) updateData.title = title;
  // if (duration) updateData.duration = duration;
  // if (studentIdStr) updateData.studentId = studentIdStr;
  // if (teacherIdStr) updateData.teacherId = teacherIdStr;
  // if (subject) updateData.subject = subject;
  // if (scheduledAt) updateData.scheduledAt = new Date(scheduledAt);
  // if (startTime) updateData.startTime = new Date(startTime);
  // if (endTime) updateData.endTime = new Date(endTime);
  // if (status) updateData.status = status;

  const updatedClass = await prisma.class.update({
    where: { id },
    data: updateData,
  });
  sendSuccess(res, {
    statusCode: 201,
    message: "class updated Successfully",
    data: updatedClass,
  });
});

export const deleteClass = asyncWrapper(async (req, res) => {
  const { id } = req.query;
  const deletedClass = await prisma.class.delete({
    where: { id },
  });
  sendSuccess(res, {
    statusCode: 201,
    message: "class deleted Successfully",
    data: deletedClass,
  });
});
export const getClass = asyncWrapper(async (req, res) => {
  const { classId } = req.params;
  if (!classId) throw new BadRequestError("classId is required");
  const classData = await prisma.class.findUnique({
    where: { classId },
    select: {
      id: true,
      title: true,
      classId: true,
      teacherId: true,
      studentId: true,
      subject: true,
      scheduledAt: true,
      startTime: true,
      endTime: true,
      status: true,
      grade: true,
      duration: true,
      classLink: true,
      teacher: {
        select: {
          name: true,
          email: true,
          profilePicture: true,
        },
      },
      student: {
        select: {
          name: true,
          email: true,
          profilePicture: true,
        },
      },
    },
  });
  sendSuccess(res, {
    statusCode: 201,
    message: "class fetched Successfully",
    data: classData,
  });
});
export const countAllClasses = asyncWrapper(async (req, res) => {
  const count = await prisma.class.count();
  sendSuccess(res, {
    statusCode: 201,
    message: "class fetched Successfully",
    data: count,
  });
});
export const countClassesByFilter = asyncWrapper(async (req, res) => {
  const { teacherId, studentId, subject, status, startDate, endDate } =
    req.query;

  const filter = {};
  if (startDate || endDate) {
    filter.startDate.gte = new Date(startDate);
    filter.startDate.lte = new Date(endDate);
  }
  filter = {
    ...(teacherId && { teacherId }),
    ...(studentId && { studentId }),
    ...(subject && { subject }),
    ...(status && { status }),
  };
  const count = await prisma.class.count({
    where: { ...filter },
  });
  sendSuccess(res, {
    statusCode: 201,
    message: "class fetched Successfully",
    data: count,
  });
});
export const getGroupedClasses = asyncWrapper(async (req, res) => {
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
  const parsedPage = Math.max(1, parseInt(page));
  console.log(req.query);
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (parsedPage - 1) * parsedLimit;
  // Build the class filter from query if provided.
  // We assume the client sends a JSON string in ?filter=
  const classFilter = {};
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
        title: true,
        classId: true,
        teacherId: true,
        studentId: true,
        subject: true,
        scheduledAt: true,
        startTime: true,
        endTime: true,
        status: true,
        grade: true,
        duration: true,
        classLink: true,
        teacher: {
          select: {
            name: true,
            email: true,
            profilePicture: true,
          },
        },
        student: {
          select: {
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
  let groupedData = null;
  if (groupBy) groupedData = classes;
  if (groupBy === "grade") {
    groupedData = classes.reduce((acc, cls) => {
      // Use scheduledAt for grouping. We are formatting it but not reducing the original field.
      const groupKey = cls.grade;
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(cls);
      return acc;
    }, {});
  } else if (groupBy) {
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
    data: groupBy ? groupedData : classes,
    metadata,
  });
});

// Get teachers for admin dropdown
