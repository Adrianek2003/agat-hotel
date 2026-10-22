# agat-hotel

Projekt i implementacja aplikacji webowej dla hotelu z wykorzystaniem silnika Babylon.js.

## Funkcje

- interaktywna scena 3D hotelu (Babylon.js) z obracaniem i przybliżaniem kamery,
- klikalne okna pokoi z podświetleniem, panelem szczegółów i przejściem do rezerwacji,
- lista pokoi z filtrem dostępności (Standard, Deluxe, Apartament),
- galeria z podglądem powiększenia,
- strona kontaktu z formularzem walidowanym po stronie klienta,
- demonstracyjny formularz rezerwacji z podsumowaniem kosztu pobytu,
- wspólny layout, nawigacja i responsywny interfejs.

Dane pokoi oraz rezerwacje są na razie lokalne (frontend). Backend i płatności są
przewidziane jako kolejny etap.

## Uruchamianie lokalnie

```bash
cd frontend
npm install
npm run dev
```

Aplikacja będzie dostępna na porcie 5173 pod adresem hosta.

## Build produkcyjny

```bash
cd frontend
npm run build
npm run preview
```

Wynik budowania trafia do katalogu `frontend/dist`.

## Wdrożenie na Vercel

Projekt frontendu można wdrożyć jako statyczną aplikację Vite:

- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

## Struktura frontendu

```text
frontend/src/
├── components/     # widoki i wspólne komponenty (Navbar, Layout, HotelScene)
├── data/rooms.ts   # dane pokoi i powiązanie z oknami w scenie 3D
├── assets/         # grafiki
├── App.tsx         # przełączanie widoków
├── index.css       # motyw, reset i wspólne klasy UI
└── types.ts        # typy nawigacji
```

## TODO

- [x] Import silnika Babylon do projektu
- [x] Wytworzenie prostej sceny 3D
- [x] Wypracowanie spójnego interfejsu dla użytkownika
- [x] Klikalne pokoje w scenie 3D i panel szczegółów
- [ ] Napisanie backendu dla aplikacji (Express + Prisma)
- [ ] Podłączenie rezerwacji do API i bazy danych
- [ ] Hosting aplikacji (Vercel)
