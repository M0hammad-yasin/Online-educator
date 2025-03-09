import { z } from "zod";
import { emailSchema } from "./general.validate.js";
// ✅ Admin Validation Schema
export const adminSchema = z.object({
  name: z.string().min(3),
  email: emailSchema,
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/,
      "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character"
    ),
  role: z.enum(["ADMIN"], { message: "Role must be 'ADMIN' only" }),
  isEmailVerified: z.boolean().default(false),
});
export const adminUpdateSchema = adminSchema.partial();
