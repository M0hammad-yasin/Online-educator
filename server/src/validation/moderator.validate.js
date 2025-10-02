import { z } from "zod";
import { emailSchema, passwordSchema } from "./general.validate.js";
import { Role } from "../constant.js";

// ✅ moderator Validation Schema
//profile picture should be a valid URL contain any image format or start with https://
export const moderatorSchema = z.object({
  name: z.string().min(3),
  email: emailSchema,
  password: passwordSchema,
  address: z
    .string({ message: "address must be string" })
    .min(5, { message: "Address is required" }),
  role: z.nativeEnum(Role).default(Role.MODERATOR),
  isEmailVerified: z.boolean().default(false),
});
export const moderatorUpdateSchema = moderatorSchema.partial();
