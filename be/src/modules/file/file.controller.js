import { z } from "zod";
import { successResponse, errorResponse } from "../../utils/responses.js";
import * as fileService from "./file.service.js";
import fs from "fs";
import path from "path";

/**
 * File Controller - Handles HTTP requests/responses
 */

// Validation schema
const uploadSchema = z.object({
  visibility: z.enum(["PUBLIC", "PRIVATE"]).optional(),
});

/**
 * Upload file
 */
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return errorResponse(res, "No file uploaded", 400);
    }

    // Validate visibility if provided
    let visibility = "PUBLIC";
    if (req.body.visibility) {
      const validated = uploadSchema.parse({ visibility: req.body.visibility });
      visibility = validated.visibility;
    }

    // Upload file
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

/**
 * Get all files for logged-in user
 */
export const getAllFiles = async (req, res) => {
  try {
    const files = await fileService.getUserFiles(req.user.id);
    return successResponse(res, "Files retrieved successfully", { files });
  } catch (error) {
    console.error("Get files error:", error);
    return errorResponse(res, "Failed to fetch files", 500);
  }
};

/**
 * Get all public files
 */
export const getAllPublicFiles = async (req, res) => {
  try {
    const files = await fileService.getAllPublicFiles();
    return successResponse(res, "Public files retrieved successfully", { files });
  } catch (error) {
    console.error("Get public files error:", error);
    return errorResponse(res, "Failed to fetch public files", 500);
  }
};

/**
 * Get public files for a specific user
 */
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

/**
 * Download file
 * Public files can be downloaded without auth
 * Private files require auth and ownership
 */
export const downloadFile = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await fileService.getFileById(id);

    if (!file) {
      return errorResponse(res, "File not found", 404);
    }

    // Check permissions for private files
    if (file.visibility === "PRIVATE") {
      // Only owner can download private files
      if (!req.user) {
        return errorResponse(res, "Authentication required for private files", 401);
      }
      if (file.userId !== req.user.id) {
        return errorResponse(res, "Access denied to private file", 403);
      }
    }

    // Check if file exists on filesystem
    if (!fs.existsSync(file.filepath)) {
      return errorResponse(res, "File not found on server", 404);
    }

    // Send file
    res.download(file.filepath, file.filename);
  } catch (error) {
    console.error("Download error:", error);
    return errorResponse(res, "Download failed", 500);
  }
};

/**
 * Delete file
 */
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

