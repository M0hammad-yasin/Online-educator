import jwt from "jsonwebtoken";
import config from "../config/config.js";

const auth = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token)
    return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

export default auth;
