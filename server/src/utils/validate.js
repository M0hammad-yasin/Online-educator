import { add } from "lodash";
import { z } from "zod";

// Common Email & Password Validations
export const emailSchema = z
  .string({ message: "Email is required" })
  .min(3, { message: "Email must be at least 3 characters long" })
  .email({ message: "Invalid email format" });
const passwordSchema = z
  .string({ message: "Password is required" })
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character",
    }
  );
// .min(6, { message: "Password must be at least 6 characters long" });

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
  qualification: z
    .string()
    .min(2, { message: "Qualification is required" })
    .optional(),
  hourlyRate: z
    .number({ invalid_type_error: "Hourly rate must be a number" })
    .min(300, { message: "Hourly rate must be at least 300" }),
  password: passwordSchema,
  role: z.enum(["TEACHER"], { message: "Role must be 'TEACHER' only" }),
  isEmailVerified: z
    .boolean({ message: "isEmailVerified must be a boolean value" })
    .default(false)
    .optional(),
});
export const teacherUpdateSchema = teacherSchema.partial();
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
export const studentUpdateSchema = studentSchema.partial();
// ✅ Admin Validation Schema
export const adminSchema = z.object({
  name: z.string().min(3),
  email: emailSchema,
  passwordHash: passwordSchema
    ._addCheck(
      (val) => val.length >= 12,
      "Password must be at least 12 characters long"
    )
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/,
      "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character"
    ),
  role: z.enum(["ADMIN"], { message: "Role must be 'ADMIN' only" }),
  isEmailVerified: z.boolean().default(false),
});
export const adminUpdateSchema = adminSchema.partial();

// ✅ Class Validation Schema
const dateTimeString = z.preprocess(
  (val) => (typeof val === "string" ? new Date(val) : val),
  z.date().refine((date) => !isNaN(date.getTime()), {
    message: "Invalid date format",
  })
);

// Zod schema for creating a Class
export const classSchema = z.object({
  // Subject is a non-empty string
  subject: z.string({ message: "subject must be a string" }).min(3, {
    message: "subject is required and must be at least 3 characters",
  }),

  // scheduledAt must be a valid datetime string
  scheduledAt: dateTimeString,

  // Optional startTime and endTime, if provided, must be valid date strings
  startTime: dateTimeString.optional(),
  // Teacher and student IDs (as strings, typically ObjectIds)
  teacherId: z
    .string({ message: "teacherId must be a string" })
    .min(1, { message: "teacherId is required" })
    .length(24, { message: "teacherId should be 24 characters" }),
  studentId: z
    .string({ message: "studentId must be a string" })
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
    .enum(["SCHEDULED", "LIVE", "CANCELLED", "COMPLETED", "IN_PROGRESS"], {
      message:
        "Status must be one of: SCHEDULED, IN_PROGRESS, CANCELLED,COMPLETED",
    })
    .default("SCHEDULED"),
});
export const classFilterQuerySchema = z.object({
  startDate: dateTimeString.optional(),
  endDate: dateTimeString.optional(),
  sortBy: z
    .enum([
      "teacher",
      "student",
      "status",
      "subject",
      "startTime",
      "day",
      "hour",
      "status",
      "month",
      "grade",
    ])
    .optional(),
  order: z
    .enum(["asc", "desc"], { message: "order must be 'asc' or 'desc'" })
    .optional(),
  studentId: mongoIdSchema.optional(),
  groupBy: z
    .enum([
      "teacher",
      "student",
      "status",
      "subject",
      "startTime",
      "day",
      "hour",
      "status",
      "month",
      "grade",
    ])
    .optional(),
  status: z
    .enum(["SCHEDULED", "LIVE", "CANCELLED", "COMPLETED", "IN_PROGRESS"])
    .optional(),
  teacherId: mongoIdSchema.optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
});
export const updateClassSchema = classSchema.partial();
// ✅ mongoId Validation Schema
export const mongoIdSchema = z.object({
  id: z
    .string({ message: "id must be string" })
    .min(24, { message: "id should be 24 characters" }),
});

// ✅ access control Validation Schema
export const accessControlSchema = z.object({
  model: z
    .string({ message: "model is required" })
    .enum(["teacher", "moderator"], {
      message: "model should be either 'Teacher' or 'Moderator'",
    }),
  canSeeUser: z.boolean({ message: "canSeeUser is required" }).optional(),
  canAddUser: z.boolean().optional(),
  canDeleteUser: z.boolean().optional(),
  canUpdateUser: z.boolean().optional(),
  canSeeTeacher: z.boolean().optional(),
  canAddTeacher: z.boolean().optional(),
  canDeleteTeacher: z.boolean().optional(),
  canUpdateTeacher: z.boolean().optional(),
  canSeeStudent: z.boolean().optional(),
  canAddStudent: z.boolean().optional(),
  canDeleteStudent: z.boolean().optional(),
  canUpdateStudent: z.boolean().optional(),
  canSeeClass: z.boolean().optional(),
  canAddClass: z.boolean().optional(),
  canDeleteClass: z.boolean().optional(),
  canUpdateClass: z.boolean().optional(),
});
// ✅ moderator Validation Schema
//profile picture should be a valid URL contain any image format or start with https://
export const moderatorSchema = z.object({
  name: z.string().min(3),
  email: emailSchema,
  password: passwordSchema,
  address: z
    .string({ message: "address must be string" })
    .min(5, { message: "Address is required" }),
  role: z.enum(["MODERATOR"], { message: "Role must be 'MODERATOR' only" }),
  isEmailVerified: z.boolean().default(false),
});
export const moderatorUpdateSchema = moderatorSchema.partial();
