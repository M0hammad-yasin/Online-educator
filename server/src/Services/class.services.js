import { format } from "date-fns";
import prisma from "../Prisma/prisma.client.js";
import { Role } from "../constant.js";
import { parseOrderBy, BadRequestError, buildPaginationMeta, getPagination, ValidationError, ConflictError, NotFoundError } from "../utils/index.js";
class ClassUtilities {

  /**
   * Format duration in hours and minutes
   */
  formatDuration(duration) {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  }

  /**
   * Build class filters for Prisma queries
   * @param {Object} query - Query parameters
   * @param {Object} [user] - Current user (optional)
   * @returns {Object} Prisma-compatible filter object
   */
  buildClassFilters(query, user = null) {
    let { teacherId, studentId, subject, status, grade, startDate, endDate, search, hour, groupBy } = query;
    if (status === "all-classes") status = null;

    const filter = {};

    // Role-based filtering
    if (user) {
      if (user.role === Role.ADMIN || user.role === Role.MODERATOR) {
        teacherId = studentId = undefined;
      } else if (user.role === Role.TEACHER) {
        teacherId = user.userId;
        studentId = undefined;
      } else if (user.role === Role.STUDENT) {
        studentId = user.userId;
        teacherId = undefined;
      }
    }

    // Date filters (UTC start/end of day)
    if (startDate || endDate) {
      filter.startTime = {};

      // If grade exists and equals hour, set extreme minutes
      if (groupBy && groupBy === "hour") {
        if (startDate) {
          const sd = new Date(`${startDate}T00:00:00.000Z`);
          sd.setMinutes(0, 0, 0);
          filter.startTime.gte = sd;
        }
        if (endDate) {
          const ed = new Date(`${endDate}T23:59:59.999Z`);
          ed.setMinutes(59, 59, 999);
          filter.startTime.lte = ed;
        }
      } else {
        if (startDate) filter.startTime.gte = new Date(`${startDate}T00:00:00.000Z`);
        if (endDate) filter.startTime.lte = new Date(`${endDate}T23:59:59.999Z`);
      }
    }
    // Additional filters
    Object.assign(filter, {
      ...(teacherId && { teacherId }),
      ...(studentId && { studentId }),
      ...(subject && { subject }),
      ...(status && { status }),
      ...(grade && { student: { grade: Number(grade) } }),
    });

    // Search filter across subject, teacher name, and student name
    if (search) {
      filter.OR = [
        { subject: { contains: search, mode: "insensitive" } },
        { teacher: { name: { contains: search, mode: "insensitive" } } },
        { student: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    return filter;
  }

  /**
   * Get pagination parameters from query
   */
  getPaginationParams(query) {
    return getPagination(query)
  }

  /**
   * Convert grade to ordinal format
   */
  gradeToOrdinal(grade) {
    const j = grade % 10,
      k = grade % 100;
    if (j === 1 && k !== 11) return grade + "st";
    if (j === 2 && k !== 12) return grade + "nd";
    if (j === 3 && k !== 13) return grade + "rd";
    return grade + "th";
  }

  /**
   * Check for scheduling conflicts
   */
  async checkSchedulingConflict(
    userId,
    role,
    newStartTime,
    newEndTime,
    id = null
  ) {
    const filter = { [role]: userId };
    if (id) filter.id = { not: id };
    newStartTime = new Date(newStartTime);
    newEndTime = new Date(newEndTime);
    const conflict = await prisma.class.findFirst({
      where: {
        ...filter,
        status: { notIn: ["COMPLETED"] },
        AND: [
          {
            OR: [
              {
                startTime: { lte: newStartTime },
                endTime: { gt: newStartTime },
              },
              {
                startTime: { lte: newEndTime },
                endTime: { gte: newEndTime },
              },
              {
                startTime: { gte: newStartTime },
                endTime: { lte: newEndTime },
              },
            ],
          },
        ],
      },
    });
    if (conflict) {
      throw new ConflictError(
        `${role.slice(0, -2)} is already scheduled at ${format(
          new Date(conflict.scheduledAt),
          "d MMMM yyyy h:mm a"
        )} for ${conflict.duration} minutes`,
        { conflictUser: `${role.slice(0, -2)}`, time: conflict.scheduledAt }
      );
    }
  }
}
export const classUtil = new ClassUtilities();
class ClassService {
  #cu = new ClassUtilities();

  async createClass(classData) {
    const student = await prisma.student.findUnique({
      where: { id: classData.studentId },
    });
    if (!student) {
      throw new NotFoundError("Student not found");
    }
    const teacher = await prisma.teacher.findUnique({
      where: { id: classData.teacherId },
    });
    if (!teacher) {
      throw new NotFoundError("Teacher not found");
    }
    classData.scheduledAt = new Date(classData.scheduledAt);
    classData.startTime = new Date(classData.startTime);
    classData.endTime = new Date(classData.endTime);


    await Promise.all([
      this.#cu.checkSchedulingConflict(
        classData.teacherId,
        "teacherId",
        classData.startTime,
        classData.endTime
      ),
      this.#cu.checkSchedulingConflict(
        classData.studentId,
        "studentId",
        classData.startTime,
        classData.endTime
      ),
    ]);

    const newClass = await prisma.class.create({
      data: {
        ...classData,
      },
    });
    return {
      newClass,
    };
  }
  async updateClass(filter, updateData) {
    const classData = await prisma.class.findUnique({ where: filter });
    if (!classData) throw new NotFoundError("Class not found");
    if (updateData.startTime) {
      updateData.startTime = new Date(updateData.startTime);
    }
    if (updateData.endTime) {
      updateData.endTime = new Date(updateData.endTime);
    }
    if (updateData.classStatus) {
      updateData.status = updateData.classStatus;
      delete updateData.classStatus;
    }
    console.log(updateData);
    // Check that the difference between startTime and endTime is >= updateData.duration or >= 59 minutes
    if (updateData.endTime && updateData.startTime) {
      const startTime = updateData.startTime ? new Date(updateData.startTime) : classData.startTime;
      const endTime = updateData.endTime ? new Date(updateData.endTime) : classData.endTime;
      const diffMs = endTime - startTime;
      const diffMinutes = diffMs / (1000 * 60);

      const requiredDuration = updateData.duration !== undefined ? updateData.duration : 59;
      if (diffMinutes > requiredDuration || diffMinutes > 59) {
        throw new BadRequestError(
          `The difference between startTime and endTime must be at least ${requiredDuration} minutes`
        );
      }
    }
    if (updateData.startTime || updateData.endTime) {
      const startTime = updateData.startTime || classData.startTime;
      const endTime = updateData.endTime || classData.endTime;
      if (updateData.teacherId) {
        await this.#cu.checkSchedulingConflict(
          updateData.teacherId,
          "teacherId",
          startTime,
          endTime,
          filter.id
        );
      }

      if (updateData.studentId) {
        await this.checkSchedulingConflict(
          updateData.studentId,
          "studentId",
          startTime,
          endTime,
          filter.id
        );
      }
    }
    const updatedClass = await prisma.class.update({
      where: { id: filter.id },
      data: updateData,
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePicture: true,
          },
        },
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePicture: true,
          },
        },
      },
    });
    return updatedClass;
  }
  async getAllClassesForAdmin(query) {
    const orderBy = parseOrderBy(query);
    const filter = this.#cu.buildClassFilters(query);
    const { skip, take, page, limit } = this.#cu.getPaginationParams(query);
    const [classes, totalClasses] = await Promise.all([
      prisma.class.findMany({
        where: filter,
        ...(query.pagination ? { skip, take } : {}),
        orderBy: orderBy && orderBy.length > 0 ? orderBy : undefined,
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
              email: true,
              profilePicture: true,
            },
          },
          student: {
            select: {
              id: true,
              name: true,
              email: true,
              profilePicture: true,
              grade: true,
            },
          },
        },
      }),
      prisma.class.count({ where: filter }),
    ]);

    // calculate pagination range
    const paginationData = buildPaginationMeta(totalClasses, page, limit)


    return {
      classes,
      paginationData,
    }
  }


  async getAllClasses(query, user) {
    const orderBy = parseOrderBy(query);
    const filter = this.#cu.buildClassFilters(query, user);
    const { skip, take, page, limit } = this.#cu.getPaginationParams(query);
    const [classes, totalClasses] = await Promise.all([
      prisma.class.findMany({
        where: filter,
        ...(query.pagination ? { skip, take } : {}),
        orderBy: orderBy && orderBy.length > 0 ? orderBy : undefined,
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
              email: true,
              profilePicture: true,
            },
          },
          student: {
            select: {
              id: true,
              name: true,
              email: true,
              profilePicture: true,
              grade: true,
            },
          },
        },
      }),
      prisma.class.count({ where: filter }),
    ]);

    const from = totalClasses === 0 ? 0 : skip + 1;
    const to = Math.min(skip + classes.length, totalClasses);

    const paginationData = buildPaginationMeta(totalClasses, page, limit)

    return {
      classes,
      paginationData,
    }
  }


  async deleteClass(filter) {
    if (!filter.id) throw new ValidationError("Class ID is required");
    const classData = await prisma.class.findUnique({ where: filter });
    if (!classData) throw new NotFoundError("Class not found");
    const deletedClass = await prisma.class.delete({ where: filter });
    return {
      deletedClass,
    };
  }

  async getClassById(filter) {
    const classData = await prisma.class.findUnique({
      where: filter,
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePicture: true,
          },
        },
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePicture: true,
          },
        },
      },
    });

    if (!classData) throw new NotFoundError("Class not found");
    return { classData };
  }
  async getClassCount(query, user) {
    const filter = this.#cu.buildClassFilters(query, user);
    const { skip, take, page, limit } = this.#cu.getPaginationParams(query);
    const [classCount, totalClasses] = await Promise.all([
      prisma.class.count({
        ...(query.pagination ? { skip, take } : {}),
        where: filter,
      }),
      prisma.class.count({ where: filter }),
    ]);
    console.log(classCount);

    const from = skip + 1;
    const to = Math.min(skip + classCount, totalClasses);
    const paginationData = buildPaginationMeta(totalClasses, page, limit)
    return {
      classCount,
      paginationData,
    };
  }
  async getClassCountForAdmin(query) {
    const filter = this.#cu.buildClassFilters(query);
    // const { skip, take, page, limit } = this.#cu.getPaginationParams(query);
    const [classCount, totalClasses] = await Promise.all([
      prisma.class.count({
        ...(query.pagination ? { skip, take } : {}),
        where: filter,
      }),
      prisma.class.count({ where: filter }),
    ]);

    // const paginationData = buildPaginationMeta(totalClasses, page, limit)
    return {
      classCount,
      // paginationData,
    };
  }
  async getClassesForSelection(query, user = null) {
    const { search = "" } = query;
    const { skip, take, page, limit } = this.#cu.getPaginationParams(query);

    const filter = {
      ...(search && {
        OR: [
          { subject: { contains: search, mode: "insensitive" } },
          { teacher: { name: { contains: search, mode: "insensitive" } } },
          { student: { name: { contains: search, mode: "insensitive" } } },
        ],
      }),
    };
    if (user?.role === Role.TEACHER) filter.teacherId = user.userId;
    if (user?.role === Role.STUDENT) filter.studentId = user.userId;

    const classes = await prisma.class.findMany({
      where: filter,
      ...(query.pagination ? { skip, take } : {}),
      select: {
        id: true,
        subject: true,
        scheduledAt: true,
        status: true,
        teacher: {
          select: {
            id: true,
            name: true,
          },
        },
        student: {
          select: {
            id: true,
            name: true,
            grade: true,
          },
        },
      },
    });

    const totalClasses = await prisma.class.count({ where: filter });
    const paginationData = buildPaginationMeta(totalClasses, page, limit)
    return {
      classes,
      paginationData,
    };
  }

  /**
   * Group classes by specified criteria
   */
  groupClasses(classes, groupBy) {
    if (!groupBy) throw new BadRequestError("groupBy field must not be empty");
    if (groupBy === "grade") {
      return classes.reduce((acc, cls) => {
        const grade = this.#cu.gradeToOrdinal(cls.student.grade);
        acc[grade] = acc[grade] || [];
        acc[grade].push(cls);
        return acc;
      }, {});
    }

    const groupKeyFormat = {
      day: "yyyy-MM-dd",
      hour: "yyyy-MM-dd HH:00",
      month: "yyyy-MM",
    }[groupBy.toLowerCase()];

    return classes.reduce((acc, cls) => {
      const groupKey = format(new Date(cls.scheduledAt), groupKeyFormat);
      acc[groupKey] = acc[groupKey] || [];
      acc[groupKey].push(cls);
      return acc;
    }, {});
  }
  countClassesByGroup = (classes, groupBy) => {
    if (!groupBy) throw new BadRequestError("group by is required");
    let groupedClassesCount = {};

    // 📘 Group by Grade
    if (groupBy === "grade") {
      groupedClassesCount = classes.reduce((acc, cls) => {
        const grade = this.#cu.gradeToOrdinal(cls.student.grade);
        acc[grade] = (acc[grade] || 0) + 1;
        return acc;
      }, {});
    }

    // 📘 Group by Day, Hour, or Month
    const validGroupBys = ["day", "hour", "month"];
    if (validGroupBys.includes(groupBy.toLowerCase())) {
      const groupKeyFormat =
        groupBy.toLowerCase() === "day"
          ? "yyyy-MM-dd"
          : groupBy.toLowerCase() === "hour"
            ? "yyyy-MM-dd HH:00"
            : "yyyy-MM";

      groupedClassesCount = classes.reduce((acc, cls) => {
        const groupKey = format(new Date(cls.scheduledAt), groupKeyFormat);
        acc[groupKey] = (acc[groupKey] || 0) + 1;
        return acc;
      }, {});
    }

    // ✅ Convert to array for Recharts
    const rechartsData = Object.entries(groupedClassesCount).map(([key, value]) => ({
      class: key,
      total: typeof value === "number" ? value : value.classCount || 0
    }));

    return rechartsData;
  };

  getCalanderViewClasses(classes) {
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
    }));
    return { calendarViewClassData: calendarData };
  }
}

export const classService = new ClassService();
