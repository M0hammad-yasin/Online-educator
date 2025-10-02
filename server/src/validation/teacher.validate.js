import { z } from "zod";
import { emailSchema, passwordSchema } from "./general.validate.js";
import { Role } from "../constant.js";
// ✅ Teacher Validation Schema
export const teacherSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(3, { message: "Name must be at least 3 characters long" }),
  email: emailSchema,
  qualification: z
    .string()
    .min(2, { message: "Qualification is required" })
    .optional(),
  hourlyRate: z
    .number({ invalid_type_error: "Hourly rate must be a number" })
    .min(300, { message: "Hourly rate must be at least 300" }).optional(),
  password: passwordSchema,
  role: z.nativeEnum(Role).default(Role.TEACHER),
  isEmailVerified: z
    .boolean({ message: "isEmailVerified must be a boolean value" })
    .default(false)
    .optional(),
});
export const teacherUpdateSchema = teacherSchema.partial();
