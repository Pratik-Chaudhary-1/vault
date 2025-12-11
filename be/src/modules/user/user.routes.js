import express from "express";
import * as userController from "./user.controller.js";

const router = express.Router();

router.get("/search", userController.searchUsers);

router.get("/:userId", userController.getUserById);

export default router;

