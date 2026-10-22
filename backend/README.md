# Agat Hotel — backend

Prosty backend dla strony hotelu: formularze, baza danych i przechowywanie plików
(zdjęcia, modele 3D, PDF itp.).

## Stack

- **Node.js 20+ / TypeScript**
- **Express 5** — API HTTP
- **Prisma 6 + PostgreSQL** — baza danych
- **Neon Object Storage / S3** — pliki na produkcji
- **Multer** — odbiór plików z formularzy
- **Zod** — walidacja danych

## Uruchomienie lokalne

Wymagania: Node.js 20+ oraz Docker (albo zewnętrzna baza PostgreSQL, np. Neon).

Z katalogu głównego repozytorium uruchom bazę:

```bash
docker compose up -d db
```

Następnie:

```bash
cd backend
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

API będzie dostępne pod `http://localhost:4000`. Sprawdzenie:

```bash
curl http://localhost:4000/api/health
```

Domyślnie pliki są zapisywane lokalnie w `backend/uploads/` (`STORAGE_DRIVER=local`).
Nie musisz konfigurować S3, żeby pracować lokalnie.

Frontend uruchamiasz osobno:

```bash
cd frontend
npm run dev
```

Vite przekazuje `/api` i `/uploads` do `http://localhost:4000`, więc lokalnie nie
trzeba ustawiać `VITE_API_URL`.

Zatrzymanie bazy:

```bash
docker compose stop db
```

Usunięcie bazy wraz z danymi:

```bash
docker compose down -v
```

## Zmienne środowiskowe

Plik `backend/.env` (wzór: `.env.example`):

| Zmienna | Opis | Przykład |
| --- | --- | --- |
| `PORT` | Port serwera | `4000` |
| `DATABASE_URL` | Connection string PostgreSQL | `postgresql://agat:agat@localhost:5432/agat?schema=public` |
| `CORS_ORIGIN` | Dozwolone adresy frontendu, oddzielone przecinkami | `https://twoja-apka.vercel.app` |
| `PUBLIC_BASE_URL` | Publiczny adres API | `https://agat-hotel-api.onrender.com` |
| `STORAGE_DRIVER` | `local` albo `s3` | `s3` |
| `UPLOAD_DIR` | Katalog plików przy `local` | `uploads` |
| `MAX_UPLOAD_MB` | Maksymalny rozmiar pliku | `25` |
| `ADMIN_TOKEN` | Token do wgrywania/usuwania plików | długi losowy ciąg |
| `S3_ENDPOINT` | Endpoint S3 (Neon/R2) | `https://br-....storage.c-2.eu-central-1.aws.neon.tech` |
| `S3_REGION` | Region S3 | `eu-central-1` |
| `S3_BUCKET` | Nazwa bucketu | `agat-media` |
| `S3_ACCESS_KEY_ID` | Klucz dostępu S3 | — |
| `S3_SECRET_ACCESS_KEY` | Sekret S3 | — |
| `S3_PUBLIC_BASE_URL` | Opcjonalny publiczny prefix plików | `https://.../agat-media` |

Przy `STORAGE_DRIVER=s3` aplikacja nie wystartuje, jeśli brakuje którejś ze zmiennych
`S3_*`. Dzięki temu błąd konfiguracji wychodzi od razu, a nie przy pierwszym uploadzie.

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

Dozwolone tematy: `rezerwacja`, `pobyt`, `konferencja`, `inne`.

### `GET /api/media`

Publiczna lista wgranych plików — z niej korzysta galeria.

### `POST /api/media` (wymaga tokenu)

Multipart, pole pliku: `file`, opcjonalny `title`.

```bash
curl -X POST https://agat-hotel-api.onrender.com/api/media \
  -H "Authorization: Bearer TWOJ_ADMIN_TOKEN" \
  -F "title=Recepcja" \
  -F "file=@recepcja.jpg"
```

Dozwolone rozszerzenia: jpg, jpeg, png, webp, gif, avif, mp4, webm, glb, gltf,
bin, obj, fbx, stl, usdz, pdf.

Dla modeli 3D najwygodniejszy jest format `.glb` (jeden samodzielny plik). Plik
`.gltf` może odwoływać się do osobnych tekstur i plików `.bin`, więc wymaga
dodatkowego wgrania i poprawienia ścieżek w modelu.

### `DELETE /api/media/:id` (wymaga tokenu)

```bash
curl -X DELETE https://agat-hotel-api.onrender.com/api/media/1 \
  -H "Authorization: Bearer TWOJ_ADMIN_TOKEN"
```

## Baza danych i pliki

- Migracje: `backend/prisma/migrations/` (commitowane do repozytorium).
- `npm run db:migrate` — tworzy/aktualizuje bazę lokalnie.
- `npm run db:deploy` — stosuje migracje na produkcji.
- `npm run db:seed` — bezpiecznie uzupełnia/aktualizuje 14 pokoi (upsert).
- `npm run db:studio` — podgląd bazy.
- Pliki lokalne: `backend/uploads/` (ignorowane przez git).
- Pliki produkcyjne: bucket S3 (Neon Object Storage lub R2).

Nie commituj `.env`, plików z `uploads/` ani danych bazy.

## Hosting: Render + Neon (darmowy wariant)

Docelowy układ:

```text
Vercel (frontend)  →  Render Free (Express API)  →  Neon Postgres
                                                └→  Neon Object Storage
```

### 1. Baza PostgreSQL w Neon

1. Załóż konto na [neon.com](https://neon.com) i utwórz projekt.
2. Wybierz region **Europe (Frankfurt)** — będzie blisko Render Frankfurt.
3. W sekcji **Connect** skopiuj **direct connection string** (nie pooler),
   np.:
   ```text
   postgresql://user:haslo@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```
4. Zachowaj go jako `DATABASE_URL`.

### 2. Bucket na pliki w Neon Object Storage

1. W projekcie Neon wejdź w **Object storage**.
2. Utwórz bucket `agat-media` z dostępem **`public_read`** (galeria musi czytać
   pliki bez tokenu).
3. Skopiuj **S3 endpoint** i **region** z konsoli, np.:
   ```text
   S3_ENDPOINT=https://br-xxxx.storage.c-2.eu-central-1.aws.neon.tech
   S3_REGION=eu-central-1
   ```
4. Utwórz credential z uprawnieniami `storage:read` i `storage:write`.
   Skopiuj `S3_ACCESS_KEY_ID` oraz `S3_SECRET_ACCESS_KEY` (sekret pokazuje się
   tylko raz).
5. `S3_PUBLIC_BASE_URL` możesz zostawić puste — aplikacja zbuduje adres jako
   `${S3_ENDPOINT}/${S3_BUCKET}`.

Object Storage jest dostępny m.in. w regionach AWS US East (Ohio/Virginia),
Frankfurt i Singapur. Sprawdź dostępność w konsoli Neon.

### 3. Backend na Render

1. Wypchnij repozytorium na GitHub.
2. W Render wybierz **New → Blueprint** i wskaż repozytorium.
   Render odczyta `render.yaml` z katalogu głównego i utworzy usługę
   `agat-hotel-api`.
3. Uzupełnij zmienne oznaczone jako `sync: false`:
   ```text
   DATABASE_URL=postgresql://...?sslmode=require
   CORS_ORIGIN=https://twoja-apka.vercel.app
   PUBLIC_BASE_URL=https://agat-hotel-api.onrender.com
   S3_ENDPOINT=https://br-xxxx.storage.c-2.eu-central-1.aws.neon.tech
   S3_REGION=eu-central-1
   S3_BUCKET=agat-media
   S3_ACCESS_KEY_ID=...
   S3_SECRET_ACCESS_KEY=...
   ```
4. `ADMIN_TOKEN` Render wygeneruje automatycznie. Odczytasz go później w
   **Environment** usługi — będzie potrzebny do wgrywania plików.
5. Wdróż. Render użyje `npm ci --include=dev`, ponieważ build i seed potrzebują
   `prisma`, `typescript` i `tsx` z `devDependencies`. Następnie uruchomi:
   ```text
   npm run db:deploy && npm run db:seed && npm start
   ```
   czyli najpierw migracje i uzupełnienie pokoi, potem API.
6. Sprawdź:
   ```bash
   curl https://agat-hotel-api.onrender.com/api/health
   ```

### 4. Frontend na Vercel

W projekcie frontendu dodaj zmienną:

```text
VITE_API_URL=https://agat-hotel-api.onrender.com
```

Zrób ponowny deploy. Vite wbudowuje tę wartość w build, więc zmiana wymaga
nowego wdrożenia.

### 5. Test uploadu na produkcji

```bash
curl -X POST https://agat-hotel-api.onrender.com/api/media \
  -H "Authorization: Bearer TWOJ_ADMIN_TOKEN" \
  -F "title=Test" \
  -F "file=@zdjecie.jpg"
```

Plik powinien pojawić się w galerii, a jego URL powinien wskazywać domenę Neon
Object Storage.

## Darmowe limity i ograniczenia

- **Render Free:** 512 MB RAM, 0.1 CPU, 750 h/mies., 5 GB transferu, usypianie po
  15 min bezczynności. Pierwsze żądanie po uśpieniu może trwać 30–60 s.
- **Neon Free:** 1 GB PostgreSQL, 100 CU-hours/mies., 5 GB egressu, 5 GB Object
  Storage. Compute usypia po 5 min i budzi się przy pierwszym zapytaniu.
- Darmowe plany nie są objęte SLA i nie służą do poważnego ruchu produkcyjnego.
- Render Free nie ma trwałego dysku — dlatego nie używamy tam SQLite ani
  lokalnego `uploads/`.
- Aby ograniczyć usypianie Render, możesz wysyłać `GET /api/health` co 10 minut
  (np. UptimeRobot). 24/7 to około 730 z 750 darmowych godzin miesięcznie.
- Rób własne kopie: `pg_dump` dla bazy i pobieranie bucketu dla plików. Free
  plany nie mają pełnych automatycznych backupów.

## Alternatywy

- **Cloudflare R2** zamiast Neon Object Storage: 10 GB i darmowy egress, ale
  aktywacja R2 wymaga karty. Wtedy ustaw `S3_ENDPOINT`, `S3_REGION=auto`,
  `S3_BUCKET` i publiczny `S3_PUBLIC_BASE_URL` (r2.dev lub własna domena).
- **Supabase** zamiast Neon: Postgres 500 MB + 1 GB plików, bez karty, ale
  projekt pauzuje po 7 dniach bezczynności.
- **Render Starter + dysk** (~7 USD/mies.): zostaje SQLite i lokalne `uploads/`,
  usługa nie usypia. Wymaga mniej zmian w kodzie, ale nie jest darmowe.

## Checklista produkcyjna

- Zmień/odczytaj `ADMIN_TOKEN` i nie publikuj go.
- Ustaw `CORS_ORIGIN` dokładnie na adres frontendu (bez `*`).
- Włącz HTTPS (Render i Neon robią to automatycznie).
- Rób kopie zapasowe bazy i bucketu.
- Dodaj rate limiting i ewentualnie captcha do publicznych formularzy.
- Nie commituj `.env`, `uploads/` ani danych bazy.

## Rozwiązywanie problemów

- **`P1001` / baza nieosiągalna:** sprawdź `DATABASE_URL`, `sslmode=require` i
  czy używasz bezpośredniego połączenia Neon (bez `-pooler`).
- **`Brak konfiguracji magazynu S3`:** uzupełnij wszystkie zmienne `S3_*` przy
  `STORAGE_DRIVER=s3`.
- **Upload 403 / brak pliku w galerii:** sprawdź, czy bucket ma dostęp
  `public_read` i czy `S3_PUBLIC_BASE_URL` wskazuje właściwy bucket.
- **CORS:** `CORS_ORIGIN` musi zawierać dokładny origin frontendu, np.
  `https://agat-hotel.vercel.app`, bez końcowego `/`.
- **Render usypia:** to normalne na planie Free; pierwsze żądanie może potrwać
  kilkadziesiąt sekund.
