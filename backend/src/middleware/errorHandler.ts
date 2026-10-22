import type { ErrorRequestHandler } from "express";
import multer from "multer";
import { ZodError } from "zod";
import { ApiError } from "../lib/ApiError";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      error: {
        message: error.message,
        details: error.details,
      },
    });
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      error: {
        message: "Nieprawidłowe dane formularza.",
        details: error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
    });
    return;
  }

  if (error instanceof multer.MulterError) {
    const message =
      error.code === "LIMIT_FILE_SIZE"
        ? "Plik jest zbyt duży."
        : `Błąd wgrywania pliku: ${error.message}`;
    res.status(400).json({ error: { message } });
    return;
  }

  if (error instanceof SyntaxError && "body" in error) {
    res.status(400).json({
      error: { message: "Nieprawidłowy JSON w treści żądania." },
    });
    return;
  }

  console.error(error);
  res.status(500).json({
    error: { message: "Wystąpił nieoczekiwany błąd serwera." },
  });
};
