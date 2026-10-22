import type { RequestHandler } from "express";
import { prisma } from "../prisma/client";
import { contactSchema } from "../validation/schemas";

export const createContactMessage: RequestHandler = async (req, res) => {
  const data = contactSchema.parse(req.body);

  const message = await prisma.contactMessage.create({ data });

  res.status(201).json({
    id: message.id,
    createdAt: message.createdAt.toISOString(),
    message: "Wiadomość została zapisana. Recepcja skontaktuje się z Tobą.",
  });
};
