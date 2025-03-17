import {
  AuthenticationError,
  AuthorizationError,
} from "../Lib/custom.error.js";
import { verifyToken } from "../Utils/jwt.user.js";

const auth = (req, res, next) => {
  // Check for token in cookies
  let token;
  if (req.headers.cookie) {
    const cookies = req.headers.cookie.split(";");
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "token") {
        token = value;
        break;
      }
    }
  }

  // If not in cookies, check Authorization header
  if (!token && req.header("Authorization")) {
    const authHeader = req.header("Authorization");
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7); // Remove "Bearer " prefix
    } else {
      token = authHeader; // If it's just the token without "Bearer"
    }
  }
  if (!token) throw new AuthenticationError("No token provided");
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    throw new AuthorizationError("Invalid token", error);
  }
};

export default auth;
