import { z } from "zod";
import { successResponse, errorResponse } from "../../utils/responses.js";
import * as authService from "./auth.service.js";

/**
 * Auth Controller - Handles HTTP requests/responses
 */

// Validation schemas
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required").optional(),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

/**
 * Register a new user
 */
export const register = async (req, res) => {
  try {
    // Validate input
    const validatedData = registerSchema.parse(req.body);

    // Register user
    const user = await authService.registerUser(validatedData);

    return successResponse(
      res,
      "User registered successfully",
      { user },
      201
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(res, error.errors[0].message, 400);
    }
    if (error.message === "Email already registered" || error.message === "Username already taken") {
      return errorResponse(res, error.message, 409);
    }
    console.error("Register error:", error);
    return errorResponse(res, "Registration failed", 500);
  }
};

/**
 * Login user
 */
export const login = async (req, res) => {
  try {
    // Validate input
    const validatedData = loginSchema.parse(req.body);

    // Login user
    const result = await authService.loginUser(
      validatedData.email,
      validatedData.password
    );

    return successResponse(res, "Login successful", result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(res, error.errors[0].message, 400);
    }
    if (error.message === "Invalid credentials") {
      return errorResponse(res, error.message, 401);
    }
    console.error("Login error:", error);
    return errorResponse(res, "Login failed", 500);
  }
};

