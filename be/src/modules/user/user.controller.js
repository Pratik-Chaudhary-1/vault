import { successResponse, errorResponse } from "../../utils/responses.js";
import * as userService from "./user.service.js";

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return errorResponse(res, "Query parameter is required", 400);
    }

    const users = await userService.searchUsers(query);

    return successResponse(res, "Users retrieved successfully", { users });
  } catch (error) {
    console.error("Search users error:", error);
    return errorResponse(res, "Failed to search users", 500);
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await userService.getUserById(userId);

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    return successResponse(res, "User retrieved successfully", { user });
  } catch (error) {
    console.error("Get user error:", error);
    return errorResponse(res, "Failed to fetch user", 500);
  }
};

