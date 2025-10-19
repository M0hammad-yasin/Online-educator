import { sendSuccess,asyncWrapper } from "../../utils/index.js";
import { classService, classUtil } from "../../Services/class.services.js";
import { Role } from "../../constant.js";

export const createClass = asyncWrapper(async (req, res) => {
  const scheduledAt = new Date(req.body.scheduledAt);
  if (!req.body.startTime) {
    req.body.startTime = new Date(scheduledAt);
  }
  if (!req.body.endTime) {
    req.body.endTime = new Date(
      scheduledAt.getTime() + req.body.duration * 60000
    );
  }
  const { newClass } = await classService.createClass(req.body);
  sendSuccess(res, {
    statusCode: 201,
    message: "Class created successfully",
    data:newClass
  });
});

export const updateClass = asyncWrapper(async (req, res) => {
  const filter = {
    id: req.params.id,
  };
  if (Role.TEACHER === req.user?.role) filter.teacherId = req.user.userId;
  console.log(req.user);
console.log(req.body);
  const updatedClass  = await classService.updateClass(filter, req.body);
  sendSuccess(res, {
    statusCode: 200,
    message: "Class updated successfully",
    data: {
      class: {
        ...updatedClass,
        duration: classUtil.formatDuration(updatedClass.duration),
      },
    },
  });
});

export const deleteClass = asyncWrapper(async (req, res) => {
  const filter = {
    id: req.params.id,
  };
  if (Role.TEACHER === req.user?.role) filter.teacherId = req.user.userId;
  const { deletedClass } = await classService.deleteClass(filter);
  sendSuccess(res, {
    statusCode: 200,
    message: "Class deleted successfully",
    data: deletedClass ,
  });
});
export const getClassCount = asyncWrapper(async (req, res) => {
  const { classCount, paginationData } = await classService.getClassCount(
    req.query,
    req.user
  );
  sendSuccess(res, {
    statusCode: 200,
    message: "Class count fetched successfully",
    data: classCount,
    pagination: paginationData,
  });
});
export const getClassCountForAdmin = asyncWrapper(async (req, res) => {
  const { classCount, paginationData } = await classService.getClassCountForAdmin(
    req.query
  );
  sendSuccess(res, {
    statusCode: 200,
    message: "Class count fetched successfully",
    data: classCount,
    pagination: paginationData,
  });
});
export const getClassById = asyncWrapper(async (req, res) => {
  const filter = {
    id: req.params.id,
  };
  if (Role.TEACHER === req.user?.role) filter.teacherId = req.user.userId;
  if (Role.STUDENT === req.user?.role) filter.studentId = req.user.userId;
  const { classData } = await classService.getClassById(filter);
  sendSuccess(res, {
    statusCode: 200,
    message: "Class fetched successfully",
    data: classData ,
  });
});
export const getAllClasses = asyncWrapper(async (req, res) => {
  const { classes, paginationData } = await classService.getAllClasses(
    req.query,
    req.user
  );
  sendSuccess(res, {
    statusCode: 200,
    message: "Classes fetched successfully",
    data: classes,
    pagination: paginationData,
  });
});
export const getAllClassesForAdmin = asyncWrapper(async (req, res) => {
  const { classes, paginationData } = await classService.getAllClassesForAdmin(
    req.query
  );

  sendSuccess(res, {
    statusCode: 200,
    message: "Classes fetched successfully",
    data: classes,
    pagination: paginationData,
  });
});
export const getClassesForSelectionByAdmin = asyncWrapper(async (req, res) => {
  const { classes, paginationData } = await classService.getClassesForSelection(
    req.query
  );

  sendSuccess(res, {
    statusCode: 200,
    message: "Classes fetched Successfully",
    data: classes,
    pagination: paginationData
  });
});
export const getClassesForSelection = asyncWrapper(async (req, res) => {
  const { classes, paginationData } = await classService.getClassesForSelection(
    req.query,
    req.user
  );

  sendSuccess(res, {
    statusCode: 200,
    message: "Classes fetched Successfully",
    data: classes,
    pagination: paginationData,
  });
});
export const getGroupedClasses = asyncWrapper(async (req, res) => {
  const { classes, paginationData } = [Role.TEACHER, Role.STUDENT].includes(
    req.user.role
  )
    ? await classService.getAllClasses(req.query, req.user)
    : await classService.getAllClassesForAdmin(req.query);
  const groupedClassData = classService.groupClasses(
    classes,
    req.query?.groupBy
  );
  sendSuccess(res, {
    statusCode: 200,
    message: "grouped Classes fetched successfully",
    data: groupedClassData,
    pagination: paginationData,
  });
      });
export const calendarViewClassData = asyncWrapper(async (req, res) => {
  const { classes, paginationData } = [Role.TEACHER, Role.STUDENT].includes(
    req.user.role
  )
    ? await classService.getAllClasses(req.query, req.user)
    : await classService.getAllClassesForAdmin(req.query);
  const calendarViewClassData = classService.getCalanderViewClasses(classes);
  sendSuccess(res, {
    statusCode: 200,
    message: "calendar View Classes fetched successfully",
    data: calendarViewClassData,
    pagination: paginationData,
  });
});
export const countClassesByGroup = asyncWrapper(async (req, res) => {
  const { classes, paginationData } = [Role.TEACHER, Role.STUDENT].includes(
    req.user.role
  )
    ? await classService.getAllClasses(req.query, req.user)
    : await classService.getAllClassesForAdmin(req.query);
  const groupedClassesCount = classService.countClassesByGroup(
    classes,
    req.query?.groupBy
  );
  sendSuccess(res, {
    statusCode: 200,
    message: "grouped Classes count fetched successfully",
    data: groupedClassesCount,
    pagination: paginationData,
  });
});



// Search Classes
export const searchClasses = asyncWrapper(async (req, res) => {
  const { classes, paginationData } = [Role.TEACHER, Role.STUDENT].includes(
    req.user.role
  )
    ? await classService.getAllClasses(req.query, req.user)
    : await classService.getAllClassesForAdmin(req.query);
  sendSuccess(res, {
    statusCode: 200,
    message: "Classes search results",
    data: classes,
    pagination:paginationData,
  });
});