import { z } from "zod";
import { emailSchema ,passwordSchema} from './general.validate.js';
// ✅ Admin Validation Schema
export const adminSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
  email: emailSchema,
  password: passwordSchema,
  role: z.enum(["ADMIN"], { message: "Role must be 'ADMIN' only" }),
  isEmailVerified: z.boolean().default(false),
});
export const adminUpdateSchema = adminSchema.partial();
