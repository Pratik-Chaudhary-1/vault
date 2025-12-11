import { z } from "zod";
import { successResponse, errorResponse } from "../../utils/responses.js";
import * as fileService from "./file.service.js";
import fs from "fs";
import path from "path";

const uploadSchema = z.object({
  visibility: z.enum(["PUBLIC", "PRIVATE"]).optional(),
});

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return errorResponse(res, "No file uploaded", 400);
    }

    let visibility = "PUBLIC";
    if (req.body.visibility) {
      const validated = uploadSchema.parse({ visibility: req.body.visibility });
      visibility = validated.visibility;
    }

    const fileRecord = await fileService.uploadFile(
      req.file,
      req.user.id,
      visibility
    );

    return successResponse(
      res,
      "File uploaded successfully",
      {
        id: fileRecord.id,
        filename: fileRecord.filename,
        size: fileRecord.size,
        visibility: fileRecord.visibility,
        createdAt: fileRecord.createdAt,
      },
      201
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(res, error.errors[0].message, 400);
    }
    console.error("Upload error:", error);
    return errorResponse(res, "File upload failed", 500);
  }
};

export const getAllFiles = async (req, res) => {
  try {
    const files = await fileService.getUserFiles(req.user.id);
    return successResponse(res, "Files retrieved successfully", { files });
  } catch (error) {
    console.error("Get files error:", error);
    return errorResponse(res, "Failed to fetch files", 500);
  }
};

export const getAllPublicFiles = async (req, res) => {
  try {
    const files = await fileService.getAllPublicFiles();
    return successResponse(res, "Public files retrieved successfully", { files });
  } catch (error) {
    console.error("Get public files error:", error);
    return errorResponse(res, "Failed to fetch public files", 500);
  }
};

export const getPublicFilesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const files = await fileService.getPublicFilesByUser(userId);
    return successResponse(res, "Public files retrieved successfully", { files });
  } catch (error) {
    console.error("Get public files error:", error);
    return errorResponse(res, "Failed to fetch public files", 500);
  }
};

export const downloadFile = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`Download request for file ID: ${id}`);

    const file = await fileService.getFileById(id);

    if (!file) {
      console.log(`File with ID ${id} not found in database`);
      res.status(404).json({ success: false, message: "File not found" });
      return;
    }
    
    console.log(`File found: ${file.filename}, path: ${file.filepath}, visibility: ${file.visibility}`);

    if (file.visibility === "PRIVATE") {
      if (!req.user) {
        res.status(401).json({ success: false, message: "Authentication required for private files" });
        return;
      }
      if (file.userId !== req.user.id) {
        res.status(403).json({ success: false, message: "Access denied to private file" });
        return;
      }
    }

    let filePath = path.resolve(file.filepath);
    const uploadsDir = path.resolve(process.cwd(), "./uploads");
    
    if (!fs.existsSync(filePath)) {
      const filenameFromPath = path.basename(file.filepath);
      const alternativePath = path.join(uploadsDir, filenameFromPath);
      
      console.log(`File not found at original path: ${filePath}`);
      console.log(`Trying alternative path: ${alternativePath}`);
      console.log(`Stored filepath in DB: ${file.filepath}`);
      console.log(`Uploads directory: ${uploadsDir}`);
      
      if (fs.existsSync(alternativePath)) {
        filePath = alternativePath;
        console.log(`Found file at alternative path: ${filePath}`);
      } else {
        try {
          if (!fs.existsSync(uploadsDir)) {
            console.error(`Uploads directory does not exist: ${uploadsDir}`);
            res.status(404).json({ success: false, message: "File not found on server" });
            return;
          }
          
          const allFiles = fs.readdirSync(uploadsDir);
          console.log(`Searching in uploads directory. Files found:`, allFiles);
          
          const matchingFile = allFiles.find(f => {
            const dbFilename = filenameFromPath.split('-').slice(1).join('-');
            return f.includes(dbFilename) || f === filenameFromPath || f.endsWith(filenameFromPath);
          });
          
          if (matchingFile) {
            filePath = path.join(uploadsDir, matchingFile);
            console.log(`Found file with matching name: ${filePath}`);
          } else {
            console.error(`File not found. Original: ${filePath}, Alternative: ${alternativePath}`);
            console.error(`Uploads directory contents:`, allFiles);
            res.status(404).json({ success: false, message: "File not found on server" });
            return;
          }
        } catch (dirError) {
          console.error(`Error reading uploads directory:`, dirError);
          res.status(404).json({ success: false, message: "File not found on server" });
          return;
        }
      }
    }

    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(file.filename)}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
    fileStream.on('error', (err) => {
      console.error('File stream error:', err);
      if (!res.headersSent) {
        res.status(500).json({ success: false, message: "Error reading file" });
      }
    });
  } catch (error) {
    console.error("Download error:", error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: error.message || "Download failed" });
    }
  }
};

export const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;

    await fileService.deleteFile(id, req.user.id);

    return successResponse(res, "File deleted successfully");
  } catch (error) {
    if (error.message === "File not found") {
      return errorResponse(res, error.message, 404);
    }
    if (error.message === "You can only delete your own files") {
      return errorResponse(res, error.message, 403);
    }
    console.error("Delete error:", error);
    return errorResponse(res, "File deletion failed", 500);
  }
};

