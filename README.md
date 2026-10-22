# agat-hotel

Projekt i implementacja aplikacji webowej dla hotelu z wykorzystaniem silnika
Babylon.js, React i prostego backendu Express + Prisma.

## Funkcje

- interaktywna scena 3D hotelu (Babylon.js) z obracaniem i przybliżaniem kamery,
- klikalne okna pokoi z podświetleniem, panelem szczegółów i przejściem do rezerwacji,
- lista pokoi z filtrem dostępności (Standard, Deluxe, Apartament),
- galeria z podglądem powiększenia i plikami wgranymi przez API,
- strona kontaktu z formularzem zapisywanym w bazie,
- rezerwacja online z walidacją terminów, dostępności i wyliczeniem kosztu,
- wspólny layout, nawigacja i responsywny interfejs.

## Struktura projektu

```text
agat-hotel/
├── frontend/   # React + Vite + Babylon.js
└── backend/    # Express + TypeScript + Prisma + SQLite + upload plików
```

## Uruchamianie lokalne

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

API działa pod `http://localhost:4000`. Szczegóły, endpointy i konfiguracja:
[`backend/README.md`](backend/README.md).

### 2. Frontend

W drugim terminalu:

```bash
cd frontend
npm install
npm run dev
```

Aplikacja będzie dostępna pod adresem wyświetlonym przez Vite (domyślnie
`http://localhost:5173`). Lokalnie Vite przekazuje `/api` i `/uploads` do backendu,
więc `VITE_API_URL` może zostać puste.

## Build produkcyjny

Frontend:

```bash
cd frontend
npm run build
npm run preview
```

Wynik trafia do `frontend/dist`.

Backend:

```bash
cd backend
npm run build
npm start
```

## Wdrożenie

- **Frontend (Vercel):** Root Directory `frontend`, Build Command `npm run build`,
  Output Directory `dist`. Dodaj zmienną `VITE_API_URL` z adresem backendu.
- **Backend:** instrukcja krok po kroku dla Render / Railway / Fly.io oraz wariantu
  Vercel + PostgreSQL + S3 znajduje się w
  [`backend/README.md`](backend/README.md#hosting-backendu).

## TODO

- [x] Import silnika Babylon do projektu
- [x] Wytworzenie prostej sceny 3D
- [x] Wypracowanie spójnego interfejsu dla użytkownika
- [x] Klikalne pokoje w scenie 3D i panel szczegółów
- [x] Backend dla formularzy, bazy danych i plików (Express + Prisma)
- [x] Podłączenie rezerwacji i kontaktu do API
- [x] Hosting frontendu na Vercel
- [ ] Hosting backendu na Render/Railway/Fly.io
