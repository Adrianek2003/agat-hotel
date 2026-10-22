import type { RequestHandler } from "express";
import { env } from "../config/env";
import { ApiError } from "../lib/ApiError";

export const requireAdmin: RequestHandler = (req, _res, next) => {
  if (!env.adminToken) {
    next(
      new ApiError(
        503,
        "Wgrywanie plików jest wyłączone — ustaw zmienną ADMIN_TOKEN.",
      ),
    );
    return;
  }

  const authorization = req.header("authorization");
  const bearerToken = authorization?.replace(/^Bearer\s+/i, "");
  const headerToken = req.header("x-admin-token");
  const token = bearerToken || headerToken;

  if (token !== env.adminToken) {
    next(new ApiError(401, "Nieprawidłowy token administratora."));
    return;
  }

  next();
};
