import { z } from "zod";
import { emailSchema, passwordSchema } from "./general.validate.js";
import { Role } from "../constant.js";
// ✅ Student Validation Schema
export const studentSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  email: emailSchema,
  parentEmail: emailSchema.optional(),
  password: passwordSchema,
  role: z.nativeEnum(Role).default(Role.STUDENT),
  isEmailVerified: z
    .boolean()
    .default(false)
    .refine((val) => typeof val === "boolean", {
      message: "isEmailVerified must be a boolean value",
    }),
  grade: z
    .number({ invalid_type_error: "Grade must be a number" })
    .min(1, { message: "Grade should not be empty" })
    .lte(12, { message: "Grade must be at most 12" }),
});
export const studentUpdateSchema = studentSchema.partial();

