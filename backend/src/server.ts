import { app } from "./app";
import { env } from "./config/env";
import { prisma } from "./prisma/client";

const server = app.listen(env.port, () => {
  console.log(`Agat Hotel API działa na http://localhost:${env.port}`);
});

let shuttingDown = false;

async function shutdown(signal: string) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`Otrzymano ${signal}, zamykanie serwera...`);

  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });

  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
