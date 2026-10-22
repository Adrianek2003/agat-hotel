import { useState } from "react";
import type { FormEvent } from "react";
import { sendContactMessage } from "../api";
import "./ContactPage.css";

type ContactField = "name" | "email" | "topic" | "message";

interface ContactForm {
  name: string;
  email: string;
  topic: string;
  message: string;
}

const INITIAL_FORM: ContactForm = {
  name: "",
  email: "",
  topic: "rezerwacja",
  message: "",
};

const CONTACT_DETAILS = [
  {
    title: "Recepcja",
    value: "+48 123 456 789",
    hint: "Dostępna całą dobę",
    href: "tel:+48123456789",
  },
  {
    title: "E-mail",
    value: "recepcja@agathotel.pl",
    hint: "Odpowiadamy w ciągu 24 godzin",
    href: "mailto:recepcja@agathotel.pl",
  },
  {
    title: "Adres",
    value: "ul. Kwiatowa 12, Warszawa",
    hint: "Parking dla gości od strony ogrodu",
  },
  {
    title: "Godziny",
    value: "Zameldowanie 15:00",
    hint: "Wymeldowanie do 11:00",
  },
];

function validate(form: ContactForm): Partial<Record<ContactField, string>> {
  const errors: Partial<Record<ContactField, string>> = {};

  if (form.name.trim().length < 3) {
    errors.name = "Podaj imię i nazwisko (min. 3 znaki).";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Podaj poprawny adres e-mail.";
  }

  if (form.message.trim().length < 10) {
    errors.message = "Wiadomość powinna mieć co najmniej 10 znaków.";
  }

  return errors;
}

function ContactPage() {
  const [form, setForm] = useState<ContactForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateField = (field: ContactField, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSent(false);
    setSubmitError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      await sendContactMessage(form);
      setSent(true);
      setForm(INITIAL_FORM);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Nie udało się wysłać wiadomości.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page contact-page">
      <div className="container">
        <div className="page-header">
          <p className="eyebrow">Kontakt</p>
          <h1 className="page-title">Jesteśmy do Twojej dyspozycji</h1>
          <p className="page-subtitle">
            Masz pytanie o pobyt, konferencję lub rezerwację grupową? Napisz do
            nas albo zadzwoń — recepcja pracuje przez całą dobę.
          </p>
        </div>

        <div className="contact-layout">
          <div className="contact-details">
            {CONTACT_DETAILS.map((detail) => (
              <div key={detail.title} className="contact-card card">
                <p className="contact-card__label">{detail.title}</p>
                {detail.href ? (
                  <a className="contact-card__value" href={detail.href}>
                    {detail.value}
                  </a>
                ) : (
                  <p className="contact-card__value">{detail.value}</p>
                )}
                <p className="contact-card__hint">{detail.hint}</p>
              </div>
            ))}
          </div>

          <form className="contact-form card" onSubmit={handleSubmit} noValidate>
            <h2 className="contact-form__title">Napisz do nas</h2>
            <p className="contact-form__intro">
              Wypełnij formularz, a recepcja skontaktuje się z Tobą e-mailem.
            </p>

            <div className="form-grid">
              <div className="field">
                <label htmlFor="contact-name">Imię i nazwisko</label>
                <input
                  id="contact-name"
                  className={`input${errors.name ? " input--invalid" : ""}`}
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  aria-invalid={Boolean(errors.name)}
                  onChange={(event) => updateField("name", event.target.value)}
                />
                {errors.name && <p className="field-error">{errors.name}</p>}
              </div>

              <div className="field">
                <label htmlFor="contact-email">Adres e-mail</label>
                <input
                  id="contact-email"
                  className={`input${errors.email ? " input--invalid" : ""}`}
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  aria-invalid={Boolean(errors.email)}
                  onChange={(event) => updateField("email", event.target.value)}
                />
                {errors.email && <p className="field-error">{errors.email}</p>}
              </div>

              <div className="field field--full">
                <label htmlFor="contact-topic">Temat</label>
                <select
                  id="contact-topic"
                  className="input"
                  value={form.topic}
                  onChange={(event) => updateField("topic", event.target.value)}
                >
                  <option value="rezerwacja">Rezerwacja</option>
                  <option value="pobyt">Pytanie o pobyt</option>
                  <option value="konferencja">Konferencja i wydarzenia</option>
                  <option value="inne">Inne</option>
                </select>
              </div>

              <div className="field field--full">
                <label htmlFor="contact-message">Wiadomość</label>
                <textarea
                  id="contact-message"
                  className={`input${errors.message ? " input--invalid" : ""}`}
                  value={form.message}
                  aria-invalid={Boolean(errors.message)}
                  onChange={(event) => updateField("message", event.target.value)}
                />
                {errors.message && <p className="field-error">{errors.message}</p>}
              </div>
            </div>

            <div className="contact-form__actions">
              <button
                type="submit"
                className="btn btn--primary"
                disabled={submitting}
              >
                {submitting ? "Wysyłanie…" : "Wyślij wiadomość"}
              </button>
              <p className="form-note">
                Wiadomość trafi bezpośrednio do skrzynki recepcji hotelu.
              </p>
            </div>

            {submitError && (
              <p className="contact-form__error" role="alert">
                {submitError}
              </p>
            )}

            {sent && (
              <p className="contact-form__success" role="status">
                Dziękujemy! Wiadomość została przyjęta. Recepcja odpowie w ciągu
                24 godzin.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

export default ContactPage;
