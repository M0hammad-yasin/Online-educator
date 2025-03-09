import { z } from "zod";

export const mongoIdSchema = z.object({
  id: z
    .string({ message: "id must be string" })
    .min(24, { message: "id should be 24 characters" }),
});
