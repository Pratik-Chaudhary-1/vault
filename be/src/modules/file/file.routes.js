import express from "express";
import multer from "multer";
import path from "path";
import { config } from "../../config/env.js";
import { authenticateToken } from "../../middleware/auth.js";
import { optionalAuthenticate } from "../../middleware/optionalAuth.js";
import * as fileController from "./file.controller.js";

const router = express.Router();

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

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.maxFileSize,
  },
});

router.post("/upload", authenticateToken, upload.single("file"), fileController.uploadFile);

router.get("/all", authenticateToken, fileController.getAllFiles);

router.get("/download/:id", optionalAuthenticate, (req, res, next) => {
  console.log(`Download route hit for ID: ${req.params.id}, URL: ${req.url}`);
  next();
}, fileController.downloadFile);

router.get("/public/:userId", fileController.getPublicFilesByUser);

router.get("/public", fileController.getAllPublicFiles);

router.delete("/:id", authenticateToken, fileController.deleteFile);

export default router;

