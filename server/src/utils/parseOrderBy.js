function parseOrderBy(query) {
  if (query.orderBy && typeof query.orderBy === "string") {
    try {
      const orderBy = JSON.parse(query.orderBy);

      return orderBy.map((entry) => {
        const [[key, direction]] = Object.entries(entry);

        // if key ends with "Name" → assume it's a relation
        if (key.endsWith("Name")) {
          const relation = key.replace("Name", ""); // e.g. teacherName → teacher
          return { [relation]: { name: direction } };
        }

        // otherwise keep as is
        return { [key]: direction };
      });
    } catch (e) {
      throw new Error("Invalid orderBy format. Must be JSON array.");
    }
  }
  return [];
}

export default parseOrderBy;