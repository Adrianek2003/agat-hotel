import "dotenv/config";

function parseOrigins(value: string): string[] {
  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

const storageDriver =
  (process.env.STORAGE_DRIVER ?? "local").trim().toLowerCase();

if (storageDriver !== "local" && storageDriver !== "s3") {
  throw new Error(
    'Nieprawidłowy STORAGE_DRIVER. Dozwolone wartości: "local" lub "s3".',
  );
}

const s3 = {
  endpoint: (process.env.S3_ENDPOINT ?? "").replace(/\/+$/, ""),
  region: process.env.S3_REGION ?? "",
  bucket: process.env.S3_BUCKET ?? "",
  accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
  publicBaseUrl: (process.env.S3_PUBLIC_BASE_URL ?? "").replace(/\/+$/, ""),
};

if (storageDriver === "s3") {
  const missing = [
    ["S3_ENDPOINT", s3.endpoint],
    ["S3_REGION", s3.region],
    ["S3_BUCKET", s3.bucket],
    ["S3_ACCESS_KEY_ID", s3.accessKeyId],
    ["S3_SECRET_ACCESS_KEY", s3.secretAccessKey],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length > 0) {
    throw new Error(
      `Brak konfiguracji magazynu S3. Uzupełnij: ${missing.join(", ")}.`,
    );
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  corsOrigins: parseOrigins(
    process.env.CORS_ORIGIN ?? "http://localhost:5173,http://localhost:4173",
  ),
  publicBaseUrl: (process.env.PUBLIC_BASE_URL ?? "").replace(/\/+$/, ""),
  storageDriver: storageDriver as "local" | "s3",
  uploadDir: process.env.UPLOAD_DIR ?? "uploads",
  maxUploadMb: Number(process.env.MAX_UPLOAD_MB ?? 50),
  adminToken: process.env.ADMIN_TOKEN ?? "",
  s3,
};

if (!env.adminToken) {
  console.warn(
    "[env] ADMIN_TOKEN nie jest ustawiony — wgrywanie i usuwanie plików będzie wyłączone.",
  );
}
