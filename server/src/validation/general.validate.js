import { z } from "zod";

// Common Email & Password Validations
export const emailSchema = z
  .string({ message: "Email is required" })
  .min(3, { message: "Email must be at least 3 characters long" })
  .email({ message: "Invalid email format" });
export const passwordSchema = z
  .string({ message: "Password is required" })
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character",
    }
  );
