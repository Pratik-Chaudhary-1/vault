import express from "express";
import cors from "cors";
import { config } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Import routes
import authRoutes from "./modules/auth/auth.routes.js";
import fileRoutes from "./modules/file/file.routes.js";
import userRoutes from "./modules/user/user.routes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/file", fileRoutes);
app.use("/api/user", userRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;

