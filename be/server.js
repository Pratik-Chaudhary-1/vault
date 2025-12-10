import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import { config } from "./config.js";
import authRoutes from "./routes/auth.js";
import fileRoutes from "./routes/files.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    limits: { fileSize: config.maxFileSize },
    abortOnLimit: true,
  })
);

app.use("/api", authRoutes);
app.use("/api", fileRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});
