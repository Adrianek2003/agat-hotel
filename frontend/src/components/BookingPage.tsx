import { useState } from "react";
import type { FormEvent } from "react";
import { createBooking } from "../api";
import { getRoomById, ROOMS } from "../data/rooms";
import type { Navigate } from "../types";
import "./BookingPage.css";

interface Props {
  selectedRoomId: string | null;
  onNavigate: Navigate;
}

interface BookingForm {
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface Confirmation {
  code: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  total: number;
}

type BookingErrors = Partial<Record<keyof BookingForm, string>>;

const AVAILABLE_ROOMS = ROOMS.filter((room) => room.available);

function toISODate(date: Date): string {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

function todayISO(): string {
  return toISODate(new Date());
}

function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00`);
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

function countNights(checkIn: string, checkOut: string): number {
  const start = new Date(`${checkIn}T00:00:00`).getTime();
  const end = new Date(`${checkOut}T00:00:00`).getTime();
  return Math.round((end - start) / 86_400_000);
}

function formatDate(isoDate: string): string {
  if (!isoDate) return "—";
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString("pl-PL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function validate(form: BookingForm): BookingErrors {
  const errors: BookingErrors = {};
  const room = getRoomById(form.roomId);

  if (!room) {
    errors.roomId = "Wybierz dostępny pokój.";
  }

  if (!form.checkIn) {
    errors.checkIn = "Wybierz datę przyjazdu.";
  }

  if (!form.checkOut) {
    errors.checkOut = "Wybierz datę wyjazdu.";
  } else if (form.checkIn && countNights(form.checkIn, form.checkOut) < 1) {
    errors.checkOut = "Data wyjazdu musi być późniejsza niż przyjazdu.";
  }

  const guests = Number(form.guests);
  if (!Number.isInteger(guests) || guests < 1) {
    errors.guests = "Podaj liczbę gości.";
  } else if (room && guests > room.capacity) {
    errors.guests = `Ten pokój mieści maksymalnie ${room.capacity} osoby.`;
  }

  if (form.firstName.trim().length < 2) {
    errors.firstName = "Podaj imię.";
  }

  if (form.lastName.trim().length < 2) {
    errors.lastName = "Podaj nazwisko.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Podaj poprawny adres e-mail.";
  }

  if (!/^[+\d][\d\s-]{7,}$/.test(form.phone)) {
    errors.phone = "Podaj poprawny numer telefonu.";
  }

  return errors;
}

function BookingPage({ selectedRoomId, onNavigate }: Props) {
  const [form, setForm] = useState<BookingForm>(() => {
    const initialRoom = getRoomById(selectedRoomId);
    return {
      roomId: initialRoom?.available ? initialRoom.id : "",
      checkIn: todayISO(),
      checkOut: addDays(todayISO(), 2),
      guests: "2",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    };
  });
  const [errors, setErrors] = useState<BookingErrors>({});
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const selectedRoom = getRoomById(form.roomId);
  const nights = countNights(form.checkIn, form.checkOut);
  const total = selectedRoom && nights > 0 ? selectedRoom.price * nights : 0;
  const maxGuests = selectedRoom?.capacity ?? 5;

  const updateField = (field: keyof BookingForm, value: string) => {
    setForm((current) => {
      const next = { ...current, [field]: value };

      if (field === "checkIn" && next.checkOut <= next.checkIn) {
        next.checkOut = addDays(next.checkIn, 1);
      }

      if (field === "roomId") {
        const room = getRoomById(value);
        if (room && Number(next.guests) > room.capacity) {
          next.guests = String(room.capacity);
        }
      }

      return next;
    });

    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0 || !selectedRoom) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const booking = await createBooking({
        roomId: form.roomId,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests: Number(form.guests),
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
      });

      setConfirmation({
        code: booking.code,
        roomName: booking.room.name,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests,
        nights: booking.nights,
        total: booking.total,
      });
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Nie udało się zapisać rezerwacji.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmation) {
    return (
      <section className="page booking-page">
        <div className="container">
          <div className="booking-confirmation card">
            <p className="eyebrow">Rezerwacja</p>
            <h1 className="page-title">Dziękujemy za rezerwację!</h1>
            <p className="page-subtitle">
              Twoja rezerwacja została zapisana w systemie hotelu. Numer
              potwierdzenia: <strong>{confirmation.code}</strong>
            </p>

            <dl className="booking-summary__list">
              <div>
                <dt>Pokój</dt>
                <dd>{confirmation.roomName}</dd>
              </div>
              <div>
                <dt>Przyjazd</dt>
                <dd>{formatDate(confirmation.checkIn)}</dd>
              </div>
              <div>
                <dt>Wyjazd</dt>
                <dd>{formatDate(confirmation.checkOut)}</dd>
              </div>
              <div>
                <dt>Goście</dt>
                <dd>{confirmation.guests} os.</dd>
              </div>
              <div>
                <dt>Liczba nocy</dt>
                <dd>{confirmation.nights}</dd>
              </div>
              <div>
                <dt>Łączny koszt</dt>
                <dd>{confirmation.total} zł</dd>
              </div>
            </dl>

            <div className="booking-confirmation__actions">
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => onNavigate("landing")}
              >
                Wróć na stronę główną
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => onNavigate("rooms")}
              >
                Przeglądaj pokoje
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page booking-page">
      <div className="container">
        <div className="page-header">
          <p className="eyebrow">Rezerwacja</p>
          <h1 className="page-title">Zarezerwuj swój pobyt</h1>
          <p className="page-subtitle">
            Wybierz pokój, termin i liczbę gości. Rezerwacja zostanie zapisana
            bezpośrednio w systemie hotelu.
          </p>
        </div>

        <div className="booking-layout">
          <form
            id="booking-form"
            className="booking-form card"
            onSubmit={handleSubmit}
            noValidate
          >
            <h2 className="booking-form__title">Dane rezerwacji</h2>

            <div className="form-grid">
              <div className="field field--full">
                <label htmlFor="booking-room">Pokój</label>
                <select
                  id="booking-room"
                  className={`input${errors.roomId ? " input--invalid" : ""}`}
                  value={form.roomId}
                  aria-invalid={Boolean(errors.roomId)}
                  onChange={(event) => updateField("roomId", event.target.value)}
                >
                  <option value="">Wybierz pokój</option>
                  {AVAILABLE_ROOMS.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} — {room.price} zł / noc ({room.capacity} os.)
                    </option>
                  ))}
                </select>
                {errors.roomId && <p className="field-error">{errors.roomId}</p>}
              </div>

              <div className="field">
                <label htmlFor="booking-checkin">Przyjazd</label>
                <input
                  id="booking-checkin"
                  className={`input${errors.checkIn ? " input--invalid" : ""}`}
                  type="date"
                  min={todayISO()}
                  value={form.checkIn}
                  aria-invalid={Boolean(errors.checkIn)}
                  onChange={(event) => updateField("checkIn", event.target.value)}
                />
                {errors.checkIn && <p className="field-error">{errors.checkIn}</p>}
              </div>

              <div className="field">
                <label htmlFor="booking-checkout">Wyjazd</label>
                <input
                  id="booking-checkout"
                  className={`input${errors.checkOut ? " input--invalid" : ""}`}
                  type="date"
                  min={form.checkIn ? addDays(form.checkIn, 1) : todayISO()}
                  value={form.checkOut}
                  aria-invalid={Boolean(errors.checkOut)}
                  onChange={(event) => updateField("checkOut", event.target.value)}
                />
                {errors.checkOut && <p className="field-error">{errors.checkOut}</p>}
              </div>

              <div className="field field--full">
                <label htmlFor="booking-guests">Liczba gości</label>
                <input
                  id="booking-guests"
                  className={`input${errors.guests ? " input--invalid" : ""}`}
                  type="number"
                  min={1}
                  max={maxGuests}
                  value={form.guests}
                  aria-invalid={Boolean(errors.guests)}
                  onChange={(event) => updateField("guests", event.target.value)}
                />
                {errors.guests ? (
                  <p className="field-error">{errors.guests}</p>
                ) : (
                  <p className="form-note">
                    Maksymalna liczba gości w tym pokoju: {maxGuests}.
                  </p>
                )}
              </div>

              <div className="field">
                <label htmlFor="booking-first-name">Imię</label>
                <input
                  id="booking-first-name"
                  className={`input${errors.firstName ? " input--invalid" : ""}`}
                  type="text"
                  autoComplete="given-name"
                  value={form.firstName}
                  aria-invalid={Boolean(errors.firstName)}
                  onChange={(event) => updateField("firstName", event.target.value)}
                />
                {errors.firstName && (
                  <p className="field-error">{errors.firstName}</p>
                )}
              </div>

              <div className="field">
                <label htmlFor="booking-last-name">Nazwisko</label>
                <input
                  id="booking-last-name"
                  className={`input${errors.lastName ? " input--invalid" : ""}`}
                  type="text"
                  autoComplete="family-name"
                  value={form.lastName}
                  aria-invalid={Boolean(errors.lastName)}
                  onChange={(event) => updateField("lastName", event.target.value)}
                />
                {errors.lastName && (
                  <p className="field-error">{errors.lastName}</p>
                )}
              </div>

              <div className="field">
                <label htmlFor="booking-email">Adres e-mail</label>
                <input
                  id="booking-email"
                  className={`input${errors.email ? " input--invalid" : ""}`}
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  aria-invalid={Boolean(errors.email)}
                  onChange={(event) => updateField("email", event.target.value)}
                />
                {errors.email && <p className="field-error">{errors.email}</p>}
              </div>

              <div className="field">
                <label htmlFor="booking-phone">Telefon</label>
                <input
                  id="booking-phone"
                  className={`input${errors.phone ? " input--invalid" : ""}`}
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  aria-invalid={Boolean(errors.phone)}
                  onChange={(event) => updateField("phone", event.target.value)}
                />
                {errors.phone && <p className="field-error">{errors.phone}</p>}
              </div>
            </div>
          </form>

          <aside className="booking-summary card" aria-label="Podsumowanie rezerwacji">
            <p className="eyebrow">Podsumowanie</p>

            {selectedRoom ? (
              <>
                <h2 className="booking-summary__room">{selectedRoom.name}</h2>
                <p className="booking-summary__description">
                  {selectedRoom.size} m² · do {selectedRoom.capacity} osób ·{" "}
                  {selectedRoom.category}
                </p>
              </>
            ) : (
              <p className="booking-summary__placeholder">
                Wybierz pokój, aby zobaczyć podsumowanie pobytu.
              </p>
            )}

            <dl className="booking-summary__list">
              <div>
                <dt>Przyjazd</dt>
                <dd>{formatDate(form.checkIn)}</dd>
              </div>
              <div>
                <dt>Wyjazd</dt>
                <dd>{formatDate(form.checkOut)}</dd>
              </div>
              <div>
                <dt>Goście</dt>
                <dd>{form.guests || "—"}</dd>
              </div>
              <div>
                <dt>Liczba nocy</dt>
                <dd>{nights > 0 ? nights : "—"}</dd>
              </div>
            </dl>

            <div className="booking-summary__total">
              <span>Łącznie</span>
              <strong>{total > 0 ? `${total} zł` : "—"}</strong>
            </div>

            <button
              type="submit"
              form="booking-form"
              className="btn btn--primary booking-summary__submit"
              disabled={!selectedRoom || submitting}
            >
              {submitting ? "Przetwarzanie…" : "Potwierdź rezerwację"}
            </button>

            {submitError && (
              <p className="booking-summary__error" role="alert">
                {submitError}
              </p>
            )}

            <p className="form-note">
              Rezerwacja zostanie zapisana w bazie hotelu. Płatność online będzie
              kolejnym etapem.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default BookingPage;
