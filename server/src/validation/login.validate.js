import { z } from "zod";
import { emailSchema } from "./general.validate.js";
export const loginSchema = z.object({
  email: emailSchema,
  password: z.union([z.string().min(1, "Password is required"), z.number().min(1, "Password is required")])
});
