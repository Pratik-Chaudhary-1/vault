import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || "your-secret",
  nodeEnv: process.env.NODE_ENV || "development",
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 20971520, // 20MB
  allowedFileTypes: process.env.ALLOWED_FILE_TYPES?.split(",") || [
    "application/pdf",
    "video/mp4",
    "image/jpeg",
    "image/png",
    "text/plain",
  ],
  uploadsDir: "./uploads",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
};

