import "dotenv/config";
import express from "express";
import cors from "cors";
import crypto from "crypto";
import { handleDemo } from "./routes/demo";

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
    if (!publicIds?.length) return res.status(400).json({ error: "No publicIds" });

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey    = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error("[cloudinary] Missing env vars — add to server .env:", {
        CLOUDINARY_CLOUD_NAME: cloudName ?? "MISSING",
        CLOUDINARY_API_KEY:    apiKey    ?? "MISSING",
        CLOUDINARY_API_SECRET: apiSecret ?? "MISSING",
      });
      return res.status(500).json({ error: "Cloudinary env vars missing on server" });
    }

    const results: Record<string, string> = {};

    for (const publicId of publicIds) {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const signature = crypto
        .createHash("sha1")
        .update(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
        .digest("hex");

      const body = new URLSearchParams({ public_id: publicId, timestamp, api_key: apiKey, signature });

      try {
        const r    = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, { method: "POST", body });
        const data = await r.json() as { result: string };
        results[publicId] = data.result;
        console.log(`[cloudinary] delete ${publicId} →`, data.result);
      } catch (err) {
        results[publicId] = "error";
        console.error(`[cloudinary] delete ${publicId} failed:`, err);
      }
    }

    return res.json({ results });
  });

  return app;
}