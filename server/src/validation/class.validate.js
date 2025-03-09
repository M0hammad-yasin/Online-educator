import { z } from "zod";
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
export const updateClassSchema = classSchema.partial();
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
  studentId: z
    .string({ message: "id must be string" })
    .min(24, { message: "id should be 24 characters" })
    .optional(),
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
    .enum(
      [
        "SCHEDULED",
        "LIVE",
        "CANCELLED",
        "COMPLETED",
        "IN_PROGRESS",
        "all-classes",
      ],
      {
        message:
          "Status must be one of: SCHEDULED, IN_PROGRESS, CANCELLED,COMPLETED, LIVE, all-classes",
      }
    )
    .optional(),
  teacherId: z
    .string({ message: "id must be string" })
    .min(24, { message: "id should be 24 characters" })
    .optional(),
  page: z
    .string()
    .refine(
      (val) => {
        return /^\d+$/.test(val) && parseInt(val, 10) > 1;
      },
      { message: "Page number must be a greater than 1" }
    )
    .optional(),
  limit: z
    .string()
    .refine(
      (val) => {
        return /^\d+$/.test(val) && parseInt(val, 10) > 1;
      },
      { message: "Limit must be a greater than 1" }
    )
    .optional(),
});
