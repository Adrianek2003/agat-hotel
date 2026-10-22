import { extname } from "node:path";
import multer from "multer";
import { env } from "../config/env";
import { ApiError } from "../lib/ApiError";

const ALLOWED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".avif",
  ".mp4",
  ".webm",
  ".glb",
  ".gltf",
  ".bin",
  ".obj",
  ".fbx",
  ".stl",
  ".usdz",
  ".pdf",
]);

const ALLOWED_MIME_PREFIXES = ["image/", "video/", "model/"];
const ALLOWED_MIME_TYPES = new Set([
  "application/octet-stream",
  "application/pdf",
  "application/json",
]);

export const uploadSingleFile = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: env.maxUploadMb * 1024 * 1024,
    files: 1,
  },
  fileFilter: (_req, file, callback) => {
    const extension = extname(file.originalname).toLowerCase();
    const hasAllowedExtension = ALLOWED_EXTENSIONS.has(extension);
    const hasAllowedMime =
      ALLOWED_MIME_PREFIXES.some((prefix) => file.mimetype.startsWith(prefix)) ||
      ALLOWED_MIME_TYPES.has(file.mimetype);

    if (!hasAllowedExtension || !hasAllowedMime) {
      callback(new ApiError(400, "Niedozwolony typ pliku."));
      return;
    }

    callback(null, true);
  },
}).single("file");
