import { format } from "date-fns";
import prisma from "../Prisma/prisma.client.js";
import { Role } from "../constant.js";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../Lib/custom.error.js";
class ClassUtilities {
  /**
   * Generate a class ID based on grade and subject
   */
  generateClassId(grade, subject) {
    function getSubjectPrefix(subject) {
      const lowerSubject = subject.toLowerCase();

      if (lowerSubject.includes("math")) return "Math";
      if (lowerSubject.includes("sci")) return "SCI";
      if (lowerSubject.includes("phy")) return "Phy";
      if (lowerSubject.includes("bio")) return "Bio";
      if (lowerSubject.includes("che")) return "Che";
      if (lowerSubject.includes("eng")) return "Eng";
      if (lowerSubject.includes("urdu")) return "Urdu";
      if (lowerSubject.includes("computer")) return "CS";

      // Fallback: return the subject capitalized
      return subject.charAt(0).toUpperCase() + subject.slice(3);
    }

    function getOrdinal(n) {
      const j = n % 10,
        k = n % 100;
      if (j === 1 && k !== 11) return n + "st";
      if (j === 2 && k !== 12) return n + "nd";
      if (j === 3 && k !== 13) return n + "rd";
      return n + "th";
    }

    const key = subject.toLowerCase();
    const prefix = getSubjectPrefix(key);
    const ordinalGrade = getOrdinal(grade);
    return `#${prefix}-${ordinalGrade}`;
  }

  /**
   * Format duration in hours and minutes
   */
  formatDuration(duration) {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  }
  dateObject(dates) {
    return dates.map((date) => new Date(date));
  }

  // Usage with object properties
  /**
   * Build filters for class queries based on user role and query parameters
   */
  buildClassFilters(query, user = null) {
    let { teacherId, studentId, subject, classStatus, startDate, endDate } =
      query;
    const filter = {};

    // Role-based filtering
    if (user && (user.role === Role.ADMIN || user.role === Role.MODERATOR)) {
      teacherId = studentId = null;
    } else if (user && user.role === Role.TEACHER) {
      teacherId = user.userId;
      studentId = null;
    } else if (user && user.role === Role.STUDENT) {
      studentId = user.userId;
      teacherId = null;
    }
    if (startDate || endDate) {
      filter.startTime = {};
      if (startDate) filter.startTime.gte = this.dateObject(startDate);
      if (endDate) filter.startTime.lte = this.dateObject(endDate);
    }

    // Additional filters
    Object.assign(filter, {
      ...(teacherId && { teacherId }),
      ...(studentId && { studentId }),
      ...(subject && { subject }),
      ...(classStatus && { status: classStatus }),
    });

    return filter;
  }

  /**
   * Get pagination parameters from query
   */
  getPaginationParams(query) {
    const page = Math.max(1, parseInt(query?.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query?.limit) || 20));
    return { skip: (page - 1) * limit, take: limit, page, limit };
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
    [newStartTime, newEndTime] = this.dateObject([newStartTime, newEndTime]);
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
        )} for ${conflict.duration} minutes`
      );
    }
  }
}
export const classUtil = new ClassUtilities();
class ClassService {
  #cu = new ClassUtilities();

  async createClass(classData) {
    [classData.scheduledAt, classData.startTime, classData.endTime] =
      this.#cu.dateObject([
        classData.scheduledAt,
        classData.startTime,
        classData.endTime,
      ]);

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

    const classId = this.#cu.generateClassId(student.grade, classData.subject);
    const newClass = await prisma.class.create({
      data: {
        ...classData,
        classId,
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
      [updateData.startTime] = this.#cu.dateObject([updateData.startTime]);
    }
    if (updateData.endTime) {
      [updateData.endTime] = this.#cu.dateObject([updateData.endTime]);
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
          id
        );
      }

      if (updateData.studentId) {
        await this.checkSchedulingConflict(
          updateData.studentId,
          "studentId",
          startTime,
          endTime,
          id
        );
      }
    }
    const updatedClass = await prisma.class.update({
      where: { id },
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
    return { updatedClass };
  }
  async getAllClassesForAdmin(query) {
    const { sortBy, sortOrder } = query;
    const filter = this.#cu.buildClassFilters(query);
    const { skip, take, page, limit } = this.#cu.getPaginationParams(query);
    const [classes, totalClasses] = await Promise.all([
      prisma.class.findMany({
        where: filter,
        skip,
        take,
        ...(sortBy && {
          orderBy: {
            [sortBy]: sortOrder,
          },
        }),
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
      prisma.class.count(),
    ]);
    const from = skip + 1;
    const to = Math.min(skip + classes.length, totalClasses);
    const paginationData = {
      total: classes.length,
      range: `${from} to ${to} of ${totalClasses}`,
      currentPage: page,
      pageSize: limit,
    };
    return {
      classes,
      metaData: {
        filter,
        paginationData,
      },
    };
  }

  async getAllClasses(query, user) {
    const { sortBy = "createdAt", sortOrder = "asc" } = query;
    const filter = this.#cu.buildClassFilters(query, user);
    const { skip, take, page, limit } = this.#cu.getPaginationParams(query);
    const [classes, totalClasses] = await Promise.all([
      prisma.class.findMany({
        where: filter,
        skip,
        take,
        orderBy: {
          [sortBy]: sortOrder,
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
      prisma.class.count(),
    ]);
    const from = skip + 1;
    const to = Math.min(skip + classes.length, totalClasses);
    const paginationData = {
      total: classes.length,
      range: `${from} to ${to} of ${totalClasses}`,
      currentPage: page,
      pageSize: limit,
    };
    return {
      classes,
      metaData: {
        filter,
        paginationData,
      },
    };
  }

  async deleteClass(filter) {
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
        ...(take && { take }),
        ...(skip && { skip }),
        where: filter,
      }),
      prisma.class.count({ where: filter }),
    ]);

    const from = skip + 1;
    const to = Math.min(skip + classCount.length, totalClasses);
    const paginationData = {
      total: classes.length,
      range: `${from} to ${to} of ${totalClasses}`,
      currentPage: page,
      pageSize: limit,
    };
    return {
      classCount,
      metaData: {
        filter,
        paginationData,
      },
    };
  }
  async getClassCountForAdmin(query) {
    const filter = this.#cu.buildClassFilters(query);
    const { skip, take, page, limit } = this.#cu.getPaginationParams(query);
    const [classCount, totalClasses] = await Promise.all([
      prisma.class.count({
        ...(take && { take }),
        ...(skip && { skip }),
        where: filter,
      }),
      prisma.class.count({ where: filter }),
    ]);

    const from = skip + 1;
    const to = Math.min(skip + classCount, totalClasses);
    const paginationData = {
      total: classCount,
      range: `${from} to ${to} of ${totalClasses}`,
      currentPage: page,
      pageSize: limit,
    };
    return {
      classCount,
      metaData: {
        filter,
        paginationData,
      },
    };
  }
  async getClassesForSelection(query, user = null) {
    const { searchData = "" } = query;
    const { skip, take, page, limit } = this.#cu.getPaginationParams(query);

    const filter = {
      ...(searchData && {
        OR: [
          { subject: { contains: searchData, mode: "insensitive" } },
          { classId: { contains: searchData, mode: "insensitive" } },
          { teacher: { name: { contains: searchData, mode: "insensitive" } } },
          { student: { name: { contains: searchData, mode: "insensitive" } } },
        ],
      }),
    };
    if (user?.role === Role.TEACHER) filter.teacherId = user.id;
    if (user?.role === Role.STUDENT) filter.studentId = user.id;

    const classes = await prisma.class.findMany({
      where: filter,
      skip,
      take,
      select: {
        id: true,
        classId: true,
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
    const from = skip + 1;
    const to = Math.min(skip + classes.length, totalClasses);
    const paginationData = {
      total: classes.length,
      range: `${from} to ${to} of ${totalClasses}`,
      currentPage: page,
      pageSize: limit,
    };
    return {
      classes,
      metaData: {
        filter: query,
        paginationData,
      },
    };
  }

  /**
   * Group classes by specified criteria
   */
  groupClasses(classes, groupBy) {
    if (!groupBy) throw new BadRequestError("groupBy field must not be empty");
    console.log("classes", classes);
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
    // console.log(Array.isArray(classes) ? "array" : "object");
    if (!groupBy) throw new BadRequestError("group by is required");

    if (groupBy === "grade") {
      // Group classes by grade and count them
      return classes.reduce((acc, cls) => {
        const grade = this.#cu.gradeToOrdinal(cls.student.grade);

        if (!acc[grade]) {
          acc[grade] = [{ classCount: 0 }];
        }

        acc[grade][0].classCount++;
        return { groupedClassesCount: acc };
      }, {});
    }

    const validGroupBys = ["day", "hour", "month"];
    if (validGroupBys.includes(groupBy.toLowerCase())) {
      const groupKeyFormat =
        groupBy.toLowerCase() === "day"
          ? "yyyy-MM-dd"
          : groupBy.toLowerCase() === "hour"
          ? "yyyy-MM-dd HH:00"
          : "yyyy-MM"; // for "month"

      return classes.reduce((acc, cls) => {
        const groupKey = format(
          this.#cu.dateObject([cls.scheduledAt])[0],
          groupKeyFormat
        );
        if (!acc[groupKey]) {
          acc[groupKey] = { classCount: 0 };
        }
        acc[groupKey].classCount++;
        return { groupedClassesCount: acc };
      }, {});
    }
    return null;
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
      classId: cls.classId,
    }));
    return { calendarViewClassData: calendarData };
  }
}

export const classService = new ClassService();
