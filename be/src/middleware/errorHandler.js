import { errorResponse } from "../utils/responses.js";

/**
 * Global error handler middleware
 * Returns JSON error responses
 */
export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.stack);

  // Prisma errors
  if (err.code === "P2002") {
    return errorResponse(res, "Duplicate entry. This record already exists.", 409);
  }

  if (err.code === "P2025") {
    return errorResponse(res, "Record not found", 404);
  }

  // Validation errors
  if (err.name === "ValidationError" || err.name === "ZodError") {
    return errorResponse(res, err.message || "Validation error", 400);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return errorResponse(res, "Invalid token", 401);
  }

  if (err.name === "TokenExpiredError") {
    return errorResponse(res, "Token expired", 401);
  }

  // Default error
  return errorResponse(
    res,
    err.message || "Something went wrong!",
    err.statusCode || 500
  );
};

