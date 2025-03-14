import _ from "lodash";
import { sendSuccess } from "../../Lib/api.response.js";
import asyncWrapper from "../../Utils/asyncWrapper.js";
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
    data: {
      class: {
        ...newClass,
        duration: classUtil.formatDuration(newClass.duration),
      },
    },
  });
});

export const updateClass = asyncWrapper(async (req, res) => {
  const filter = {
    id: req.params.id,
  };
  if (Role.TEACHER === req.user?.role) filter.teacherId = req.user.userId;

  const { updatedClass } = await classService.updateClass(filter, req.body);
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
    data: { deletedClass },
  });
});
export const getClassCount = asyncWrapper(async (req, res) => {
  const { classCount, metaData } = await classService.getClassCount(
    req.query,
    req.user
  );
  sendSuccess(res, {
    statusCode: 200,
    message: "Class count fetched successfully",
    data: { classCount },
    metaData,
  });
});
export const getClassCountForAdmin = asyncWrapper(async (req, res) => {
  const { classCount, metaData } = await classService.getClassCountForAdmin(
    req.query
  );
  sendSuccess(res, {
    statusCode: 200,
    message: "Class count fetched successfully",
    data: { classCount },
    metaData,
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
    data: { class: classData },
  });
});
export const getAllClasses = asyncWrapper(async (req, res) => {
  const { classes, metaData } = await classService.getAllClasses(
    req.query,
    req.user
  );
  sendSuccess(res, {
    statusCode: 200,
    message: "Classes fetched successfully",
    data: { classes },
    metaData,
  });
});
export const getAllClassesForAdmin = asyncWrapper(async (req, res) => {
  const { classes, metaData } = await classService.getAllClassesForAdmin(
    req.query
  );
  sendSuccess(res, {
    statusCode: 200,
    message: "Classes fetched successfully",
    data: { classes },
    metaData,
  });
});
export const getClassesForSelectionByAdmin = asyncWrapper(async (req, res) => {
  const { classes, metaData } = await classService.getClassesForSelection(
    req.query
  );

  sendSuccess(res, {
    statusCode: 200,
    message: "Classes fetched Successfully",
    data: { classes },
    metaData,
  });
});
export const getClassesForSelection = asyncWrapper(async (req, res) => {
  const { classes, metaData } = await classService.getClassesForSelection(
    req.query,
    req.user
  );

  sendSuccess(res, {
    statusCode: 200,
    message: "Classes fetched Successfully",
    data: { classes },
    metaData,
  });
});
export const getGroupedClasses = asyncWrapper(async (req, res) => {
  const { classes, metaData } = [Role.TEACHER, Role.STUDENT].includes(
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
    data: { groupedClassData },
    metadata: {
      ...metaData,
      filter: {
        ...metaData.filter, // Preserve existing filter fields
        groupBy: req.query?.groupBy, // Add groupBy from query
      },
    },
  });
});
export const calendarViewClassData = asyncWrapper(async (req, res) => {
  const { classes, metaData } = [Role.TEACHER, Role.STUDENT].includes(
    req.user.role
  )
    ? await classService.getAllClasses(req.query, req.user)
    : await classService.getAllClassesForAdmin(req.query);
  const calendarViewClassData = classService.getCalanderViewClasses(classes);
  sendSuccess(res, {
    statusCode: 200,
    message: "grouped Classes fetched successfully",
    data: calendarViewClassData,
    metaData,
  });
});
export const countClassesByGroup = asyncWrapper(async (req, res) => {
  const { classes, metaData } = [Role.TEACHER, Role.STUDENT].includes(
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
    message: "grouped Classes fetched successfully",
    data: groupedClassesCount,
    metadata: {
      ...metaData,
      filter: {
        ...metaData.filter, // Preserve existing filter fields
        groupBy: req.query?.groupBy, // Add groupBy from query
      },
    },
  });
});
