import type { Request, RequestHandler } from "express";
import type { MediaAsset } from "@prisma/client";
import { env } from "../config/env";
import { ApiError } from "../lib/ApiError";
import { prisma } from "../prisma/client";
import { deleteStoredFile, storeUploadedFile } from "../storage/files";

function publicBaseUrl(req: Request): string {
  if (env.publicBaseUrl) return env.publicBaseUrl;
  return `${req.protocol}://${req.get("host")}`;
}

function toMediaResponse(asset: MediaAsset, req: Request) {
  const url = /^https?:\/\//i.test(asset.url)
    ? asset.url
    : `${publicBaseUrl(req)}${asset.url}`;

  return { ...asset, url };
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

  const stored = await storeUploadedFile(req.file);
  const titleFromBody =
    typeof req.body.title === "string" ? req.body.title.trim() : "";
  const title = (titleFromBody || req.file.originalname).slice(0, 120);

  try {
    const asset = await prisma.mediaAsset.create({
      data: {
        title,
        filename: stored.key,
        originalName: req.file.originalname,
        url: stored.url,
        mimeType: req.file.mimetype,
        size: req.file.size,
      },
    });

    res.status(201).json(toMediaResponse(asset, req));
  } catch (error) {
    await deleteStoredFile(stored.key).catch(() => undefined);
    throw error;
  }
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
  await deleteStoredFile(asset.filename).catch((error) => {
    console.error("[media] Nie udało się usunąć pliku ze storage:", error);
  });

  res.status(204).send();
};
