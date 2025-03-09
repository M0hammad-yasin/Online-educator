import { z } from "zod";
import { emailSchema, passwordSchema } from "./general.validate.js";
export const userSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  email: emailSchema,
  password: passwordSchema,
});
export const userUpdateSchema = userSchema.partial();
