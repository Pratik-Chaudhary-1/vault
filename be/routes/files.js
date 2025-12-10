import express from "express";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { authenticateToken } from "../middleware/auth.js";
import { config } from "../config/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const prisma = new PrismaClient();

// Upload file
router.post("/upload", authenticateToken, async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.files.file;
    const { privacy } = req.body;

    // Validate file size
    if (file.size > config.maxFileSize) {
      return res.status(400).json({ error: "File size exceeds 20MB limit" });
    }

    // Validate file type
    if (!config.allowedFileTypes.includes(file.mimetype)) {
      return res
        .status(400)
        .json({ error: "Only PDF and MP4 files are allowed" });
    }

    // Sanitize filename
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFilename = `${Date.now()}-${sanitizedFilename}`;
    const uploadPath = path.join(
      process.cwd(),
      config.uploadsDir,
      uniqueFilename
    );

    // Ensure uploads directory exists
    if (!fs.existsSync(path.join(process.cwd(), config.uploadsDir))) {
      fs.mkdirSync(path.join(process.cwd(), config.uploadsDir), {
        recursive: true,
      });
    }

    // Move file
    await file.mv(uploadPath);

    // Save to database
    const fileRecord = await prisma.file.create({
      data: {
        filename: sanitizedFilename,
        path: uploadPath,
        size: file.size,
        privacy: privacy || "public",
        uploadedBy: req.user.id,
      },
    });

    res.status(201).json({
      message: "File uploaded successfully",
      file: {
        id: fileRecord.id,
        filename: fileRecord.filename,
        size: fileRecord.size,
        privacy: fileRecord.privacy,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "File upload failed" });
  }
});

// Get public files
router.get("/public-files", async (req, res) => {
  try {
    const files = await prisma.file.findMany({
      where: { privacy: "public" },
      include: {
        user: {
          select: { username: true },
        },
      },
      orderBy: { uploadedAt: "desc" },
    });

    const formattedFiles = files.map((file) => ({
      id: file.id,
      filename: file.filename,
      size: file.size,
      uploadedBy: file.user.username,
      uploadedAt: file.uploadedAt,
    }));

    res.json({ files: formattedFiles });
  } catch (error) {
    console.error("Fetch public files error:", error);
    res.status(500).json({ error: "Failed to fetch public files" });
  }
});

// Get user's files
router.get("/my-files", authenticateToken, async (req, res) => {
  try {
    const files = await prisma.file.findMany({
      where: { uploadedBy: req.user.id },
      orderBy: { uploadedAt: "desc" },
    });

    res.json({ files });
  } catch (error) {
    console.error("Fetch my files error:", error);
    res.status(500).json({ error: "Failed to fetch files" });
  }
});

// Download file
router.get("/files/:id/download", async (req, res) => {
  try {
    const { id } = req.params;

    const file = await prisma.file.findUnique({
      where: { id },
    });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Check permissions
    if (file.privacy === "private") {
      // Verify token if available
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      if (token) {
        try {
          const jwt = await import("jsonwebtoken");
          const user = jwt.default.verify(token, config.jwtSecret);
          if (file.uploadedBy !== user.id) {
            return res.status(403).json({ error: "Access denied" });
          }
        } catch {
          return res.status(403).json({ error: "Access denied" });
        }
      } else {
        return res.status(403).json({ error: "Access denied to private file" });
      }
    }

    // Check if file exists
    if (!fs.existsSync(file.path)) {
      return res.status(404).json({ error: "File not found on server" });
    }

    res.download(file.path, file.filename);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ error: "Download failed" });
  }
});

// Delete file
router.delete("/files/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const file = await prisma.file.findUnique({
      where: { id },
    });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Check ownership
    if (file.uploadedBy !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You can only delete your own files" });
    }

    // Delete file from filesystem
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Delete from database
    await prisma.file.delete({ where: { id } });

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "File deletion failed" });
  }
});

export default router;
