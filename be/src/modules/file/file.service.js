import prisma from "../../config/prisma.js";
import path from "path";
import fs from "fs";
import { config } from "../../config/env.js";

export const uploadFile = async (file, userId, visibility) => {
  const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
  const uniqueFilename = `${Date.now()}-${sanitizedFilename}`;
  const filepath = path.join(process.cwd(), config.uploadsDir, uniqueFilename);

  const uploadsDir = path.join(process.cwd(), config.uploadsDir);
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const fileRecord = await prisma.file.create({
    data: {
      filename: sanitizedFilename,
      filepath: filepath,
      size: file.size,
      visibility: visibility || "PUBLIC",
      userId: userId,
    },
    include: {
      user: {
        select: {
          username: true,
          email: true,
        },
      },
    },
  });

  return fileRecord;
};

export const getUserFiles = async (userId) => {
  return await prisma.file.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });
};

export const getPublicFilesByUser = async (userId) => {
  return await prisma.file.findMany({
    where: {
      userId,
      visibility: "PUBLIC",
    },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });
};

export const getAllPublicFiles = async () => {
  return await prisma.file.findMany({
    where: { visibility: "PUBLIC" },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });
};

export const getFileById = async (fileId) => {
  return await prisma.file.findUnique({
    where: { id: fileId },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });
};

export const deleteFile = async (fileId, userId) => {
  const file = await prisma.file.findUnique({
    where: { id: fileId },
  });

  if (!file) {
    throw new Error("File not found");
  }

  if (file.userId !== userId) {
    throw new Error("You can only delete your own files");
  }

  if (fs.existsSync(file.filepath)) {
    fs.unlinkSync(file.filepath);
  }

  await prisma.file.delete({
    where: { id: fileId },
  });

  return { message: "File deleted successfully" };
};

