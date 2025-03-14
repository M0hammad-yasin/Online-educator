import jwt from "jsonwebtoken";
import config from "../Config/config.js";
// Generate JWT Token
export const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtSecretExpiry }
  );
};

// Verify JWT Token
export const verifyToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};
