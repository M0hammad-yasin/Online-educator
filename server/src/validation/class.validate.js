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

  // Duration as an integer greater than 40 minutes
  duration: z.number().int().min(40, {
    message: "Duration must be greater than 40 minutes"
  }),

  // Status must be one of the allowed uppercase values
  classStatus: z
    .enum(["SCHEDULED", "LIVE", "CANCELLED", "COMPLETED", "IN_PROGRESS"], {
      message:
        "Status must be one of: SCHEDULED, IN_PROGRESS, CANCELLED,COMPLETED",
    })
    .default("SCHEDULED"),
});
export const updateClassSchema = classSchema.partial();
// allowed fields for sorting
const sortFieldEnum = z.enum([
  "teacherName",
  "studentName",
  "status",
  "subject",
  "startTime",
  "duration",
  "grade",
]);

// single orderBy object
const orderBySchema = z.record(sortFieldEnum, z.enum(["asc", "desc"]));

// array of orderBy objects
const orderByArraySchema = z.array(orderBySchema);

// parse stringified JSON from query
const orderByQuerySchema = z
  .string()
  .transform((val, ctx) => {
    try {
      const parsed = JSON.parse(val);
      return orderByArraySchema.parse(parsed);
    } catch (e) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid orderBy format. Must be a JSON array like [{\"startTime\":\"desc\"}]",
      });
      return z.NEVER;
    }
  })
  .optional();

export const classFilterQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  orderBy: orderByQuerySchema, 
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
      "month",
      "grade",
    ])
    .optional(),
  classStatus: z
    .enum(
      [
        "SCHEDULED",
        "CANCELLED",
        "COMPLETED",
        "IN_PROGRESS",
        "all-classes",
      ],
      {
        message:
          "Status must be one of: SCHEDULED, IN_PROGRESS, CANCELLED, COMPLETED, all-classes",
      }
    )
    .optional(),
  teacherId: z
    .string({ message: "id must be string" })
    .min(24, { message: "id should be 24 characters" })
    .optional(),
  page: z
    .string()
    .refine((val) => /^\d+$/.test(val) && parseInt(val, 10) > 0, {
      message: "Page number must be a greater than 1",
    })
    .optional(),
  limit: z
    .string()
    .refine((val) => /^\d+$/.test(val) && parseInt(val, 10) > 1, {
      message: "Limit must be a greater than 1",
    })
    .optional(),
});
