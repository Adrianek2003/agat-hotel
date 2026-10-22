import { z } from "zod";

const dateOnly = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Data musi mieć format RRRR-MM-DD.");

export const contactSchema = z.object({
  name: z.string().trim().min(3, "Podaj imię i nazwisko.").max(100),
  email: z.string().trim().email("Podaj poprawny adres e-mail.").max(200),
  topic: z.enum(["rezerwacja", "pobyt", "konferencja", "inne"]),
  message: z
    .string()
    .trim()
    .min(10, "Wiadomość powinna mieć co najmniej 10 znaków.")
    .max(5000),
});

export const bookingSchema = z
  .object({
    roomId: z.string().trim().min(1, "Wybierz pokój.").max(20),
    checkIn: dateOnly,
    checkOut: dateOnly,
    guests: z.coerce
      .number()
      .int("Liczba gości musi być liczbą całkowitą.")
      .min(1, "Podaj liczbę gości.")
      .max(10),
    firstName: z.string().trim().min(2, "Podaj imię.").max(100),
    lastName: z.string().trim().min(2, "Podaj nazwisko.").max(100),
    email: z.string().trim().email("Podaj poprawny adres e-mail.").max(200),
    phone: z
      .string()
      .trim()
      .regex(/^[+\d][\d\s-]{7,}$/, "Podaj poprawny numer telefonu."),
  })
  .refine((data) => data.checkOut > data.checkIn, {
    message: "Data wyjazdu musi być późniejsza niż przyjazdu.",
    path: ["checkOut"],
  });
