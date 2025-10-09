import { z } from "zod";

export default z.object({
  page: z
    .string()
    .refine(
      (val) => {
        return /^\d+$/.test(val) && parseInt(val, 10) > 0;
      },
      { message: "Page number must be a greater than 0" }
    )
    .optional(),
  limit: z
    .string()
    .refine(
      (val) => {
        return /^\d+$/.test(val) && parseInt(val, 10) > 5;
      },
      { message: "Limit must be a greater than 5" }
    )
    .optional(),
});
