import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import { prisma } from "./prisma/client";
import { bookingsRouter } from "./routes/bookings";
import { contactRouter } from "./routes/contact";
import { mediaRouter } from "./routes/media";
import { roomsRouter } from "./routes/rooms";
import { uploadDir } from "./storage/files";

export const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(
  cors({
    origin(origin, callback) {
      const allowed =
        !origin ||
        env.corsOrigins.includes("*") ||
        env.corsOrigins.includes(origin);
      callback(null, allowed);
    },
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Admin-Token"],
  }),
);

app.use(express.json({ limit: "1mb" }));

app.get("/", (_req, res) => {
  res.json({
    name: "Agat Hotel API",
    status: "ok",
    endpoints: [
      "GET /api/health",
      "GET /api/rooms",
      "POST /api/bookings",
      "POST /api/contact",
      "GET /api/media",
      "POST /api/media (admin)",
      "DELETE /api/media/:id (admin)",
    ],
  });
});

app.get("/api/health", async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use("/api/rooms", roomsRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/contact", contactRouter);
app.use("/api/media", mediaRouter);

app.use(
  "/uploads",
  express.static(uploadDir, {
    maxAge: "1h",
    setHeaders: (res) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  }),
);

app.use("/api", (_req, res) => {
  res.status(404).json({
    error: { message: "Nie znaleziono takiego endpointu API." },
  });
});

app.use(errorHandler);
