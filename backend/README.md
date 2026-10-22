# Agat Hotel — backend

Prosty backend dla strony hotelu: formularze, baza danych i przechowywanie plików
(zdjęcia, modele 3D, PDF itp.).

## Stack

- **Node.js 20+ / TypeScript**
- **Express 5** — API HTTP
- **Prisma 6 + SQLite** — baza danych
- **Multer** — wgrywanie plików na dysk
- **Zod** — walidacja danych formularzy

## Co obsługuje

- listę pokoi z bazy danych,
- zapis rezerwacji z walidacją terminu, liczby gości i kolizji rezerwacji,
- zapis wiadomości z formularza kontaktowego,
- wgrywanie plików do `uploads/` i publiczne ich udostępnianie,
- listę plików wykorzystywaną przez galerię na froncie.

## Uruchomienie lokalne

Wymagania: Node.js 20 lub nowszy.

```bash
cd backend
cp .env.example .env
```

Otwórz `.env` i ustaw własny `ADMIN_TOKEN` (np. wynik `openssl rand -hex 32`).
Następnie:

```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

API będzie dostępne pod `http://localhost:4000`. Sprawdzenie:

```bash
curl http://localhost:4000/api/health
```

Frontend uruchamiasz osobno:

```bash
cd frontend
npm run dev
```

Vite przekazuje `/api` i `/uploads` do `http://localhost:4000`, więc lokalnie nie
trzeba ustawiać `VITE_API_URL`.

## Zmienne środowiskowe

Plik `backend/.env` (wzór: `.env.example`):

| Zmienna | Opis | Przykład |
| --- | --- | --- |
| `PORT` | Port serwera | `4000` |
| `DATABASE_URL` | Adres bazy SQLite | `file:./dev.db` |
| `CORS_ORIGIN` | Dozwolone adresy frontendu, oddzielone przecinkami | `https://twoja-apka.vercel.app` |
| `PUBLIC_BASE_URL` | Publiczny adres API używany w URL-ach plików | `https://agat-api.onrender.com` |
| `UPLOAD_DIR` | Katalog na wgrane pliki | `uploads` |
| `MAX_UPLOAD_MB` | Maksymalny rozmiar pliku | `50` |
| `ADMIN_TOKEN` | Token do wgrywania/usuwania plików | długi losowy ciąg |

## API

### `GET /api/health`

Status serwera i bazy.

### `GET /api/rooms`

Lista pokoi. Opcjonalnie `?available=true`.

### `POST /api/bookings`

```json
{
  "roomId": "001",
  "checkIn": "2026-11-10",
  "checkOut": "2026-11-12",
  "guests": 2,
  "firstName": "Jan",
  "lastName": "Kowalski",
  "email": "jan@example.com",
  "phone": "+48 600 123 456"
}
```

Serwer sprawdza dostępność pokoju, nakładanie się terminów i wylicza koszt na
podstawie ceny z bazy. Odpowiedź zawiera numer rezerwacji (`code`) i podsumowanie.

### `POST /api/contact`

```json
{
  "name": "Anna Nowak",
  "email": "anna@example.com",
  "topic": "rezerwacja",
  "message": "Proszę o kontakt w sprawie apartamentu."
}
```

### `GET /api/media`

Publiczna lista wgranych plików — z niej korzysta galeria.

### `POST /api/media` (wymaga tokenu)

Multipart, pole pliku: `file`, opcjonalny `title`.

```bash
curl -X POST http://localhost:4000/api/media \
  -H "Authorization: Bearer TWOJ_ADMIN_TOKEN" \
  -F "title=Recepcja" \
  -F "file=@recepcja.jpg"
```

Dozwolone rozszerzenia: jpg, jpeg, png, webp, gif, avif, mp4, webm, glb, gltf,
bin, obj, fbx, stl, usdz, pdf. Limity ustawiasz przez `MAX_UPLOAD_MB`.

Dla modeli 3D najwygodniejszy jest format `.glb` (jeden samodzielny plik). Plik
`.gltf` może odwoływać się do osobnych tekstur i plików `.bin`, więc wymaga
dodatkowego wgrania i poprawienia ścieżek w modelu.

### `DELETE /api/media/:id` (wymaga tokenu)

```bash
curl -X DELETE http://localhost:4000/api/media/1 \
  -H "Authorization: Bearer TWOJ_ADMIN_TOKEN"
```

Wgrane pliki są serwowane pod `/uploads/<nazwa-pliku>`.

## Baza danych i pliki

- Baza lokalna: `backend/prisma/dev.db` (ignorowana przez git).
- Migracje: `backend/prisma/migrations/` (commitowane do repozytorium).
- Pliki: `backend/uploads/` (ignorowane przez git).
- Odświeżenie danych pokoi: `npm run db:seed`.
- Podgląd bazy: `npm run db:studio`.

Na produkcji **nie używaj** lokalnej bazy ani katalogu `uploads` bez trwałego
dysku — dane znikną przy restarcie/wdrożeniu.

## Hosting backendu

### Wariant 1 (najprostszy): Render + trwały dysk

Ten wariant zachowuje SQLite i lokalne pliki. Potrzebujesz płatnego planu z
trwałym dyskiem (np. Render Starter + Disk).

1. Wypchnij repozytorium na GitHub.
2. W Render wybierz **New → Web Service** i podłącz repozytorium.
3. Ustaw:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run db:deploy && npm run db:seed && npm start`
4. Dodaj **Persistent Disk**:
   - mount path: `/var/data`
   - rozmiar: np. 1 GB
5. W **Environment** ustaw:
   ```text
   NODE_ENV=production
   DATABASE_URL=file:/var/data/agat.db
   UPLOAD_DIR=/var/data/uploads
   PUBLIC_BASE_URL=https://twoja-nazwa.onrender.com
   CORS_ORIGIN=https://twoja-apka.vercel.app
   ADMIN_TOKEN=wygenerowany-dlugi-token
   MAX_UPLOAD_MB=50
   ```
6. Wdróż usługę i sprawdź `https://twoja-nazwa.onrender.com/api/health`.
7. W Vercel (frontend) dodaj zmienną:
   ```text
   VITE_API_URL=https://twoja-nazwa.onrender.com
   ```
8. Zrób ponowny deploy frontendu na Vercel.

`db:deploy` wykonuje migracje, a `db:seed` bezpiecznie uzupełnia/aktualizuje pokoje
(upsert) przy każdym starcie.

### Wariant 2: Railway / Fly.io

Działanie jest analogiczne: usługa Node uruchamiana z katalogu `backend`, trwały
wolumen (np. `/data`), a w zmiennych:

```text
DATABASE_URL=file:/data/agat.db
UPLOAD_DIR=/data/uploads
PUBLIC_BASE_URL=https://twoja-domena
```

Railway i Fly.io również oferują wolumeny trwałe.

### Wariant 3: wszystko na Vercel (bez trwałego dysku)

Vercel nadaje się do frontendu, ale funkcje serverless nie mają trwałego dysku.
Jeśli chcesz trzymać backend na Vercel:

1. Zmień bazę na PostgreSQL (np. Neon lub Supabase).
2. W `schema.prisma` ustaw `provider = "postgresql"` i wygeneruj nowe migracje.
3. Zamiast lokalnego `uploads/` użyj Cloudflare R2, AWS S3 lub Vercel Blob.
4. Wdróż API jako Vercel Function (np. przez adapter Express) i ustaw zmienne
   środowiskowe.

To rozwiązanie jest lepsze przy większym ruchu, ale wymaga więcej konfiguracji niż
wariant Render + dysk.

## Checklista produkcyjna

- Zmień `ADMIN_TOKEN` na długi, losowy i nie publikuj go.
- Ustaw `CORS_ORIGIN` dokładnie na adres frontendu (bez `*`).
- Włącz HTTPS (Render/Railway robią to automatycznie).
- Rób kopie zapasowe bazy i katalogu `uploads` (np. pobieranie dysku).
- Dodaj rate limiting i ewentualnie captcha do formularzy publicznych.
- Nie commituj `.env`, `dev.db` ani `uploads/`.
