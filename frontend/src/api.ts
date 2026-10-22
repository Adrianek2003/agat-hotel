export const API_BASE = (
  import.meta.env.VITE_API_URL ?? ""
).replace(/\/+$/, "");

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);

  if (init?.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE}${path}`, { ...init, headers });

  if (!response.ok) {
    let message = "Nie udało się wykonać operacji.";
    try {
      const body = (await response.json()) as {
        error?: { message?: string };
      };
      if (body.error?.message) message = body.error.message;
    } catch {
      // Odpowiedź nie jest JSON-em — zostawiamy domyślny komunikat.
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export interface ContactPayload {
  name: string;
  email: string;
  topic: string;
  message: string;
}

export function sendContactMessage(payload: ContactPayload) {
  return request<{ id: number; message: string }>("/api/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export interface BookingPayload {
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface BookingResponse {
  id: number;
  code: string;
  status: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  total: number;
  room: {
    id: number;
    code: string;
    name: string;
    category: string;
    price: number;
  };
  createdAt: string;
}

export function createBooking(payload: BookingPayload) {
  return request<BookingResponse>("/api/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export interface MediaAsset {
  id: number;
  title: string;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export function fetchMedia() {
  return request<MediaAsset[]>("/api/media");
}

export function resolveMediaUrl(url: string) {
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_BASE}${url}`;
}
