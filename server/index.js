import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import multer from "multer";
import {
  analyzeScreenshotInput,
  analyzeTextInput,
  createHealthResponse,
  getErrorMessage,
  getErrorStatus,
  localUploadLimitBytes,
  supportedMimeTypes
} from "./analysis.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: localUploadLimitBytes },
  fileFilter: (_req, file, callback) => {
    if (!supportedMimeTypes.includes(file.mimetype)) {
      callback(new Error("Unsupported file type. Use PNG, JPG, JPEG, or WEBP."));
      return;
    }
    callback(null, true);
  }
});

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => {
  res.json(createHealthResponse());
});

app.post("/api/analyze-text", async (req, res) => {
  try {
    const result = await analyzeTextInput({
      ...(req.body ?? {}),
      apiKey: req.get("x-openai-api-key")
    });
    res.json(result);
  } catch (error) {
    res.status(getErrorStatus(error)).json({ error: getErrorMessage(error) });
  }
});

app.post("/api/analyze-screenshot", (req, res, next) => {
  upload.single("image")(req, res, (error) => {
    if (error) {
      const message =
        error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE"
          ? "Image is too large. Please use a file under 8MB."
          : error.message || "Upload failed.";
      res.status(400).json({ error: message });
      return;
    }
    next();
  });
});

app.post("/api/analyze-screenshot", async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      res.status(400).json({ error: "Please upload an image to analyze." });
      return;
    }

    const result = await analyzeScreenshotInput({
      imageBuffer: file.buffer,
      mimeType: file.mimetype,
      size: file.size,
      context: req.body?.context,
      goal: req.body?.goal,
      apiKey: req.get("x-openai-api-key")
    });

    res.json(result);
  } catch (error) {
    res.status(getErrorStatus(error)).json({ error: getErrorMessage(error) });
  }
});

app.use((error, _req, res, _next) => {
  console.error("Server error:", error);
  res.status(500).json({
    error: "Something went wrong on the server."
  });
});

app.listen(port, () => {
  console.log(`UncringeAI server listening on http://localhost:${port}`);
});
