import { z } from "zod";

export default z.object({
  page: z
    .string()
    .refine(
      (val) => {
        return /^\d+$/.test(val) && parseInt(val, 10) > 1;
      },
      { message: "Page number must be a greater than 1" }
    )
    .optional(),
  limit: z
    .string()
    .refine(
      (val) => {
        return /^\d+$/.test(val) && parseInt(val, 10) > 1;
      },
      { message: "Limit must be a greater than 1" }
    )
    .optional(),
});
