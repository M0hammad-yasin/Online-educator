// ✅ access control Validation Schema
import { z } from "zod";
export const accessControlSchemaBody = z.object({
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
