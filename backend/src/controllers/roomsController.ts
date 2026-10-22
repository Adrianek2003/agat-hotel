import type { RequestHandler } from "express";
import { prisma } from "../prisma/client";

function parseFeatures(value: string): string[] {
  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string");
    }
  } catch {
    return [];
  }
  return [];
}

export const listRooms: RequestHandler = async (req, res) => {
  const onlyAvailable = req.query.available === "true";
  const rooms = await prisma.room.findMany({
    where: onlyAvailable ? { available: true } : undefined,
    orderBy: { code: "asc" },
  });

  res.json(
    rooms.map((room) => ({
      ...room,
      features: parseFeatures(room.features),
    })),
  );
};
