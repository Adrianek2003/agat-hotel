import "dotenv/config";

function parseOrigins(value: string): string[] {
  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  corsOrigins: parseOrigins(
    process.env.CORS_ORIGIN ?? "http://localhost:5173,http://localhost:4173",
  ),
  publicBaseUrl: (process.env.PUBLIC_BASE_URL ?? "").replace(/\/+$/, ""),
  uploadDir: process.env.UPLOAD_DIR ?? "uploads",
  maxUploadMb: Number(process.env.MAX_UPLOAD_MB ?? 50),
  adminToken: process.env.ADMIN_TOKEN ?? "",
};

if (!env.adminToken) {
  console.warn(
    "[env] ADMIN_TOKEN nie jest ustawiony — wgrywanie i usuwanie plików będzie wyłączone.",
  );
}
