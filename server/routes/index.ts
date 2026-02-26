import dotenv from "dotenv";
import path from "path";
import express from "express";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import { handleDemo } from "./demo";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/api/ping", (_req, res) => {
    res.json({ message: process.env.PING_MESSAGE ?? "ping" });
  });

  app.get("/api/demo", handleDemo);

  // ── Cloudinary delete ──────────────────────────────────────────
  app.post("/api/cloudinary/delete", async (req, res) => {
    const { publicIds } = req.body as { publicIds: string[] };
    if (!publicIds?.length)
      return res.status(400).json({ error: "No publicIds provided" });

    const cloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.VITE_CLOUDINARY_API_KEY;
    const apiSecret = process.env.VITE_CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error("[cloudinary] Missing env vars", {
        cloudName,
        apiKey,
        apiSecret,
      });
      return res
        .status(500)
        .json({ error: "Cloudinary env vars missing on server" });
    }

    // Configure SDK
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    const results: Record<string, string> = {};

    for (const publicId of publicIds) {
      try {
        const result = await cloudinary.uploader.destroy(publicId);
        results[publicId] = result.result; // "ok" or "not found"
        console.log(`[cloudinary] delete ${publicId} →`, result.result);
      } catch (err) {
        results[publicId] = "error";
        console.error(`[cloudinary] delete ${publicId} failed:`, err);
      }
    }

    return res.json({ results });
  });

  return app;
}
