import { format } from "date-fns";

export const groupClasses = (classes, groupBy) => {
  const validGroupBys = ["day", "hour", "month", "grade"];
  if (!groupBy || !validGroupBys.includes(groupBy.toLowerCase())) return null;

  return classes.reduce((acc, cls) => {
    let groupKey;

    if (groupBy.toLowerCase() === "grade") {
      groupKey = cls.student.grade;
    } else {
      const formatString = {
        day: "yyyy-MM-dd",
        hour: "yyyy-MM-dd HH:00",
        month: "yyyy-MM",
      }[groupBy.toLowerCase()];

      groupKey = format(new Date(cls.scheduledAt), formatString);
    }

    acc[groupKey] = acc[groupKey] || [];
    acc[groupKey].push(cls);
    return acc;
  }, {});
};
