import { randomBytes } from "node:crypto";
import type { RequestHandler } from "express";
import { ApiError } from "../lib/ApiError";
import { prisma } from "../prisma/client";
import { bookingSchema } from "../validation/schemas";

function parseDateOnly(value: string, fieldName: string): Date {
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    throw new ApiError(400, `Nieprawidłowa data: ${fieldName}.`);
  }
  return date;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

async function generateBookingCode(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = `AG-${randomBytes(4).toString("hex").toUpperCase()}`;
    const existing = await prisma.booking.findUnique({
      where: { code },
      select: { id: true },
    });
    if (!existing) return code;
  }

  throw new Error("Nie udało się wygenerować unikalnego numeru rezerwacji.");
}

export const createBooking: RequestHandler = async (req, res) => {
  const data = bookingSchema.parse(req.body);

  if (data.checkIn < todayISO()) {
    throw new ApiError(400, "Data przyjazdu nie może być z przeszłości.");
  }

  const checkIn = parseDateOnly(data.checkIn, "przyjazd");
  const checkOut = parseDateOnly(data.checkOut, "wyjazd");
  const nights = Math.round(
    (checkOut.getTime() - checkIn.getTime()) / 86_400_000,
  );

  const room = await prisma.room.findUnique({ where: { code: data.roomId } });
  if (!room) {
    throw new ApiError(404, "Wybrany pokój nie istnieje.");
  }

  if (!room.available) {
    throw new ApiError(409, "Ten pokój jest obecnie niedostępny.");
  }

  if (data.guests > room.capacity) {
    throw new ApiError(
      400,
      `Ten pokój mieści maksymalnie ${room.capacity} osoby.`,
    );
  }

  const overlapping = await prisma.booking.findFirst({
    where: {
      roomId: room.id,
      status: { not: "cancelled" },
      checkIn: { lt: checkOut },
      checkOut: { gt: checkIn },
    },
    select: { code: true },
  });

  if (overlapping) {
    throw new ApiError(
      409,
      "Pokój jest już zarezerwowany w wybranym terminie. Wybierz inny termin lub pokój.",
    );
  }

  const booking = await prisma.booking.create({
    data: {
      code: await generateBookingCode(),
      roomId: room.id,
      checkIn,
      checkOut,
      guests: data.guests,
      nights,
      total: room.price * nights,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
    },
    include: { room: true },
  });

  res.status(201).json({
    id: booking.id,
    code: booking.code,
    status: booking.status,
    checkIn: data.checkIn,
    checkOut: data.checkOut,
    guests: booking.guests,
    nights: booking.nights,
    total: booking.total,
    room: {
      id: booking.room.id,
      code: booking.room.code,
      name: booking.room.name,
      category: booking.room.category,
      price: booking.room.price,
    },
    createdAt: booking.createdAt.toISOString(),
  });
};
