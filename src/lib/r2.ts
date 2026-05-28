import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  type ListObjectsV2CommandInput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export const BUCKET = process.env.R2_BUCKET_NAME!;
export const PUBLIC_URL = (process.env.R2_PUBLIC_URL ?? "").replace(/\/$/, "");

export function getPublicUrl(key: string): string {
  return `${PUBLIC_URL}/${key}`;
}

export async function getPresignedUploadUrl(
  key: string,
  contentType: string
): Promise<string> {
  const cmd = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(r2Client, cmd, { expiresIn: 3600 });
}

export async function putJsonObject(key: string, data: unknown): Promise<void> {
  const cmd = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: JSON.stringify(data),
    ContentType: "application/json",
  });
  await r2Client.send(cmd);
}

export async function getJsonObject<T>(key: string): Promise<T | null> {
  try {
    const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
    const res = await r2Client.send(cmd);
    const text = await res.Body?.transformToString();
    if (!text) return null;
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export async function listObjects(
  prefix: string,
  opts: { maxKeys?: number; continuationToken?: string } = {}
) {
  const input: ListObjectsV2CommandInput = {
    Bucket: BUCKET,
    Prefix: prefix,
    MaxKeys: opts.maxKeys ?? 500,
  };
  if (opts.continuationToken) {
    input.ContinuationToken = opts.continuationToken;
  }
  return r2Client.send(new ListObjectsV2Command(input));
}
