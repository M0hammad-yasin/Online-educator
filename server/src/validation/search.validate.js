// server/src/validation/search.validate.js
import { z } from "zod";
export const searchQuerySchema = z.object({
  search: z.string().min(1, "Search query is required").max(30, "Query too long"),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
});