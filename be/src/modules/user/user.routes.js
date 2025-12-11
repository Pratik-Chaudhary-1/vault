import express from "express";
import * as userController from "./user.controller.js";

const router = express.Router();

// GET /api/user/search?query=<text> - Search users
router.get("/search", userController.searchUsers);

// GET /api/user/:userId - Get user by ID (public profile)
router.get("/:userId", userController.getUserById);

export default router;

