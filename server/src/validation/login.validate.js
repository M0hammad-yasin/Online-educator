import { z } from "zod";
import { emailSchema, passwordSchema } from "./general.validate.js";
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
