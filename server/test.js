function groupClasses(classes, groupBy) {
  if (!groupBy) throw new BadRequestError("groupBy field must not be empty");
  console.log("classes", classes);
  if (groupBy === "grade") {
    return classes.reduce((acc, cls) => {
      const grade = cls.student.grade;
      acc[grade] = acc[grade] || [];
      acc[grade].push(cls);
      return acc;
    }, {});
  }
}
hasRole("MODERATOR");
