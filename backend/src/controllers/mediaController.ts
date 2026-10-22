import { unlink } from "node:fs/promises";
import { join } from "node:path";
import type { Request, RequestHandler } from "express";
import { env } from "../config/env";
import { ApiError } from "../lib/ApiError";
import { prisma } from "../prisma/client";
import { uploadDir } from "../storage/upload";
import type { MediaAsset } from "@prisma/client";

function publicBaseUrl(req: Request): string {
  if (env.publicBaseUrl) return env.publicBaseUrl;
  return `${req.protocol}://${req.get("host")}`;
}

function toMediaResponse(asset: MediaAsset, req: Request) {
  return {
    ...asset,
    url: `${publicBaseUrl(req)}${asset.url}`,
  };
}

export const listMedia: RequestHandler = async (req, res) => {
  const assets = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
  });

  res.json(assets.map((asset) => toMediaResponse(asset, req)));
};

export const uploadMedia: RequestHandler = async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Dodaj plik w polu \"file\".");
  }

  const titleFromBody =
    typeof req.body.title === "string" ? req.body.title.trim() : "";
  const title = (titleFromBody || req.file.originalname).slice(0, 120);
  const url = `/uploads/${req.file.filename}`;

  const asset = await prisma.mediaAsset.create({
    data: {
      title,
      filename: req.file.filename,
      originalName: req.file.originalname,
      url,
      mimeType: req.file.mimetype,
      size: req.file.size,
    },
  });

  res.status(201).json(toMediaResponse(asset, req));
};

export const deleteMedia: RequestHandler = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    throw new ApiError(400, "Nieprawidłowy identyfikator pliku.");
  }

  const asset = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!asset) {
    throw new ApiError(404, "Plik nie istnieje.");
  }

  await prisma.mediaAsset.delete({ where: { id } });
  await unlink(join(uploadDir, asset.filename)).catch(() => undefined);

  res.status(204).send();
};
