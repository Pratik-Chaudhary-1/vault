import { verifyToken } from "../utils/token.js";

/**
 * Optional authentication middleware
 * Sets req.user if token is valid, but doesn't fail if no token is provided
 */
export const optionalAuthenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token) {
    try {
      const decoded = verifyToken(token);
      req.user = { id: decoded.id, email: decoded.email };
    } catch (error) {
      // Invalid token, but continue without setting req.user
      req.user = null;
    }
  }

  next();
};

