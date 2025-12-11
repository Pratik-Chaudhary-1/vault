import { verifyToken } from "../utils/token.js";
import { errorResponse } from "../utils/responses.js";


export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return errorResponse(res, "Access token required", 401);
  }

  try {
    const decoded = verifyToken(token);
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (error) {
    return errorResponse(res, "Invalid or expired token", 403);
  }
};

