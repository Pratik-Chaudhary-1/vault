import express from "express";
import multer from "multer";
import path from "path";
import { config } from "../../config/env.js";
import { authenticateToken } from "../../middleware/auth.js";
import { optionalAuthenticate } from "../../middleware/optionalAuth.js";
import * as fileController from "./file.controller.js";

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(process.cwd(), config.uploadsDir);
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFilename = `${Date.now()}-${sanitizedFilename}`;
    cb(null, uniqueFilename);
  },
});

// File filter for allowed types
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf",
    "video/mp4",
    "image/jpeg",
    "image/png",
    "text/plain",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, MP4, JPG, PNG, and TXT files are allowed"), false);
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.maxFileSize, // 20MB
  },
});

// POST /api/file/upload - Upload file (auth required)
router.post("/upload", authenticateToken, upload.single("file"), fileController.uploadFile);

// GET /api/file/all - Get all user's files (auth required)
router.get("/all", authenticateToken, fileController.getAllFiles);

// GET /api/file/public/:userId - Get public files for a user (must come before /public)
router.get("/public/:userId", fileController.getPublicFilesByUser);

// GET /api/file/public - Get all public files
router.get("/public", fileController.getAllPublicFiles);

// GET /api/file/download/:id - Download file (auth optional for public files)
router.get("/download/:id", optionalAuthenticate, fileController.downloadFile);

// DELETE /api/file/:id - Delete file (auth required, owner only)
router.delete("/:id", authenticateToken, fileController.deleteFile);

export default router;

