// utils/parseOrderBy.js
function parseOrderBy(query) {
    
    if (query.orderBy && typeof query.orderBy === "string") {
      try {
        return JSON.parse(query.orderBy);
      } catch (e) {
        throw new Error("Invalid orderBy format. Must be JSON array.");
      }
    }
    return [];
  }
export default parseOrderBy;
  