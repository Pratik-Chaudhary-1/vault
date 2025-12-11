import { verifyToken } from "../utils/token.js";

export const optionalAuthenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token) {
    try {
      const decoded = verifyToken(token);
      req.user = { id: decoded.id, email: decoded.email };
    } catch (error) {
      req.user = null;
    }
  }

  next();
};

