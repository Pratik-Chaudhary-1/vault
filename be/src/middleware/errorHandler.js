import { errorResponse } from "../utils/responses.js";

export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.stack || err.message || err);

  if (err.code === "P2002") {
    return errorResponse(res, "Duplicate entry. This record already exists.", 409);
  }

  if (err.code === "P2025") {
    return errorResponse(res, "Record not found", 404);
  }

  if (err.name === "ValidationError" || err.name === "ZodError") {
    return errorResponse(res, err.message || "Validation error", 400);
  }

  if (err.name === "JsonWebTokenError") {
    return errorResponse(res, "Invalid token", 401);
  }

  if (err.name === "TokenExpiredError") {
    return errorResponse(res, "Token expired", 401);
  }

  return errorResponse(
    res,
    err.message || "Something went wrong!",
    err.statusCode || 500
  );
};

