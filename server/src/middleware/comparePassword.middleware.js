import { BadRequestError, ServerError } from "../lib/custom.error";
import prisma from "../Prisma/prisma.client";
import { comparePassword, hashPassword } from "../utils/bcrypt";

export default async (req, res, next) => {
  const { existingPassword, password, confirmPassword } = req.body;
  const user = req.user;
  if (!user) {
    throw new ServerError("User not found");
  }
  const model =
    user.role === "STUDENT"
      ? "student"
      : user.role === "TEACHER"
      ? "teacher"
      : user.role === "ADMIN"
      ? "admin"
      : "moderator";
  const length = user.admin ? 12 : 8;
  if (!password && !confirmPassword) {
    throw new BadRequestError("Password and confirm password are required");
  }
  if (
    !password.match(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{length,}$/
    )
  ) {
    throw new BadRequestError(
      `Password must be at least ${length} characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character`
    );
  }
  if (password !== confirmPassword) {
    throw new BadRequestError("Password and confirm password do not match");
  }
  if (!model) {
    throw new BadRequestError("role is not defined");
  }
  const existUser = await prisma[model].findUnique({ id: user.userId });
  if (!existUser) {
    throw new BadRequestError("User not found");
  }

  const isMatch = await comparePassword(
    existingPassword,
    existUser.passwordHash
  );
  if (!isMatch) {
    throw new BadRequestError("Incorrect password");
  }
  req.body.password = await hashPassword(password);
  req.body.model = model;
  next();
};
