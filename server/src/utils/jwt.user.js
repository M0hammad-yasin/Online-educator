import jwt from "jsonwebtoken";

// Generate JWT Token
export const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

// Verify JWT Token
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
