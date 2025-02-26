import { z } from "zod";

// Common Email & Password Validations
export const emailSchema = z
  .string()
  .min(3)
  .email({ message: "Invalid email format" });
const passwordSchema = z
  .string()
  .min(6, { message: "Password must be at least 6 characters long" });

// ✅ User Validation Schema
export const userSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// ✅ Teacher Validation Schema
export const teacherSchema = z.object({
  name: z.string().min(3),
  email: emailSchema,
  qualification: z.string().min(2, { message: "Qualification is required" }),
  hourlyRate: z
    .number()
    .min(300, { message: "Hourly rate must be at least 300" }),
  password: passwordSchema,
  role: z.enum(["TEACHER"], { message: "Role must be 'STUDENT' only" }),
  isEmailVerified: z
    .boolean()
    .default(false)
    .refine((val) => typeof val === "boolean", {
      message: "isEmailVerified must be a boolean value",
    }),
});

// ✅ Student Validation Schema
export const studentSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  email: emailSchema,
  parentEmail: emailSchema.optional(),
  passwordHash: passwordSchema,
  role: z.enum(["STUDENT"], { message: "Role must be 'STUDENT' only" }),
  isEmailVerified: z
    .boolean()
    .default(false)
    .refine((val) => typeof val === "boolean", {
      message: "isEmailVerified must be a boolean value",
    }),
});

// ✅ Admin Validation Schema
export const adminSchema = z.object({
  name: z.string().min(3),
  email: emailSchema,
  passwordHash: passwordSchema,
  isEmailVerified: z.boolean().default(false),
});

// ✅ Class Validation Schema
export const classSchema = z.object({
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  teacherId: z.string().length(24),
  studentId: z.string().length(24),
  status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED"]).default("SCHEDULED"),
});
