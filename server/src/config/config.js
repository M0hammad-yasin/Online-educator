import config from "dotenv";
config.config();

export default {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET,
  jwtSecretExpiry: process.env.JWT_SECRET_EXPIRES_IN,
  isProduction: process.env.NODE_ENV === "production",
  mongoURI: process.env.MONGO_URI,
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
  // ... other configurations
};
