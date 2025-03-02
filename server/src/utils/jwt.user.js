import jwt from "jsonwebtoken";
import config from "../config/config.js";
// Generate JWT Token
export const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

// Verify JWT Token
export const verifyToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};
