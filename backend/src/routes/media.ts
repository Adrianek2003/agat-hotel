import { Router } from "express";
import {
  deleteMedia,
  listMedia,
  uploadMedia,
} from "../controllers/mediaController";
import { requireAdmin } from "../middleware/auth";
import { uploadSingleFile } from "../storage/upload";

export const mediaRouter = Router();

mediaRouter.get("/", listMedia);
mediaRouter.post("/", requireAdmin, uploadSingleFile, uploadMedia);
mediaRouter.delete("/:id", requireAdmin, deleteMedia);
