import {
  AuthenticationError,
  AuthorizationError,
} from "../Lib/custom.error.js";
import { verifyToken } from "../Utils/jwt.user.js";

const auth = (req, res, next) => {
  const token = req.cookies?.token || req.header("Authorization");
  if (!token) throw new AuthenticationError("No token provided");
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    console.log(decoded);
    next();
  } catch (error) {
    throw new AuthorizationError("Invalid token", error);
  }
};

export default auth;
