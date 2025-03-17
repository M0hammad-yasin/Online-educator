import {
  AuthorizationError,
  BadRequestError,
  ServerError,
} from "../Lib/custom.error.js";
import prisma from "../Prisma/prisma.client.js";
import { comparePassword, hashPassword } from "../Utils/bcrypt.js";

export default async (req, res, next) => {
  const { existingPassword, password, confirmPassword } = req.body;
  const user = req.user;
  if (!user) {
    throw new ServerError("user is authenticated but not found");
  }
  const modelArr = [Role.ADMIN, Role.MODERATOR, Role.STUDENT, Role.TEACHER];
  if (!modelArr.includes(req.user.role)) {
    throw new AuthorizationError(
      `you are not allowed to edit password of ${req.user.role}`
    );
  }
  const modelIndex = modelArr.indexOf(req.user.role);
  const model = String(modelArr[modelIndex]).toLowerCase();
  // const model =
  //   user.role === "STUDENT"
  //     ? "student"
  //     : user.role === "TEACHER"
  //     ? "teacher"
  //     : user.role === "ADMIN"
  //     ? "admin"
  //     : "moderator";
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
  const existUser = await prisma[model].findUnique({ id: user.userId });
  if (!existUser) {
    throw new ServerError("user is authenticated but not found");
  }

  const isMatch = await comparePassword(
    existingPassword,
    existUser.passwordHash
  );
  if (!isMatch) {
    throw new BadRequestError("Incorrect password");
  }
  req.user.password = await hashPassword(password);
  req.user.model = model;
  next();
};
