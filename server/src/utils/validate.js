import { z } from "zod";

// Common Email & Password Validations
export const emailSchema = z
  .string({ message: "Email is required" })
  .min(3, { message: "Email must be at least 3 characters long" })
  .email({ message: "Invalid email format" });
const passwordSchema = z
  .string({ message: "Password is required" })
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
  name: z
    .string({ message: "Name is required" })
    .min(3, { message: "Name must be at least 3 characters long" }),
  email: emailSchema,
  qualification: z.string().min(2, { message: "Qualification is required" }),
  hourlyRate: z
    .number({ invalid_type_error: "Hourly rate must be a number" })
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
  grade: z
    .number({ invalid_type_error: "Grade must be a number" })
    .min(1, { message: "Grade should not be empty" })
    .lte(12, { message: "Grade must be at most 12" }),
});

// ✅ Admin Validation Schema
export const adminSchema = z.object({
  name: z.string().min(3),
  email: emailSchema,
  passwordHash: passwordSchema,
  isEmailVerified: z.boolean().default(false),
});

// ✅ Class Validation Schema
const dateTimeString = z.string().refine((val) => !isNaN(Date.parse(val)), {
  message: "Invalid date format",
});

// Zod schema for creating a Class
export const classSchema = z.object({
  // Subject is a non-empty string
  subject: z
    .string({ message: "subject is required" })
    .min(1, { message: "subject is required" }),

  // scheduledAt must be a valid datetime string
  scheduledAt: dateTimeString,

  // Optional startTime and endTime, if provided, must be valid date strings
  startTime: dateTimeString.optional(),
  // Teacher and student IDs (as strings, typically ObjectIds)
  teacherId: z
    .string({ message: "teacherId is required" })
    .min(1, { message: "teacherId is required" })
    .length(24, { message: "teacherId should be 24 characters" }),
  studentId: z
    .string({ message: "studentId is required" })
    .min(1, { message: "studentId is required" })
    .length(24, { message: "studentId should be 24 characters" }),

  // classLink: if provided, must match the secure Conceptboard URL pattern
  classLink: z
    .string()
    .regex(
      /^https:\/\/app\.conceptboard\.com\/board\/(?:[A-Za-z0-9]{4}-){4}[A-Za-z0-9]{4}$/,
      {
        message:
          "classLink must follow the pattern https://app.conceptboard.com/board/XXXX-XXXX-XXXX-XXXX-XXXX",
      }
    )
    .optional(),

  // Duration as a string that represents a number greater than 40 minutes
  duration: z.string().refine(
    (val) => {
      const n = parseInt(val, 10);
      return !isNaN(n) && n > 40;
    },
    { message: "Duration must be greater than 40 minutes" }
  ),

  // Status must be one of the allowed uppercase values
  status: z
    .enum(["SCHEDULED", "LIVE", "CANCEL", "COMPLETED", "IN_PROGRESS"], {
      message:
        "Status must be one of: SCHEDULED, IN_PROGRESS, CANCELLED,COMPLETED",
    })
    .default("SCHEDULED"),
});
export const updateClassSchema = classSchema.partial();
export const mongoIdSchema = z.object({
  id: z
    .string({ message: "id must be number" })
    .min(24, { message: "id should be 24 characters" }),
});
