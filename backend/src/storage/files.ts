import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { basename, extname, join, resolve } from "node:path";
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { env } from "../config/env";

export const uploadDir = resolve(process.cwd(), env.uploadDir);

export interface StoredFile {
  key: string;
  url: string;
}

const s3Client =
  env.storageDriver === "s3"
    ? new S3Client({
        endpoint: env.s3.endpoint,
        region: env.s3.region,
        forcePathStyle: true,
        credentials: {
          accessKeyId: env.s3.accessKeyId,
          secretAccessKey: env.s3.secretAccessKey,
        },
      })
    : null;

function s3PublicBaseUrl(): string {
  if (env.s3.publicBaseUrl) return env.s3.publicBaseUrl;
  return `${env.s3.endpoint}/${env.s3.bucket}`;
}

export async function storeUploadedFile(
  file: Express.Multer.File,
): Promise<StoredFile> {
  const extension = extname(file.originalname).toLowerCase();
  const key = `${randomUUID()}${extension}`;

  if (env.storageDriver === "s3") {
    await s3Client!.send(
      new PutObjectCommand({
        Bucket: env.s3.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );

    return { key, url: `${s3PublicBaseUrl()}/${key}` };
  }

  await mkdir(uploadDir, { recursive: true });
  await writeFile(join(uploadDir, key), file.buffer);

  return { key, url: `/uploads/${key}` };
}

export async function deleteStoredFile(key: string): Promise<void> {
  if (env.storageDriver === "s3") {
    await s3Client!.send(
      new DeleteObjectCommand({
        Bucket: env.s3.bucket,
        Key: key,
      }),
    );
    return;
  }

  await unlink(join(uploadDir, basename(key))).catch(() => undefined);
}
