import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  type ListObjectsV2CommandInput,
} from "@aws-sdk/client-s3";

const client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.CF_R2_BUCKET!;

export async function cfUpload(key: string, body: ArrayBuffer, contentType: string) {
  await client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: new Uint8Array(body),
      ContentType: contentType,
    })
  );
}

export async function cfGetObject(key: string): Promise<Response> {
  const res = await client.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
  const stream = res.Body?.transformToWebStream() ?? null;
  return new Response(stream, {
    headers: { "Content-Type": res.ContentType ?? "application/octet-stream" },
  });
}

export async function cfPutJson(key: string, data: unknown) {
  const body = new TextEncoder().encode(JSON.stringify(data));
  await cfUpload(key, body.buffer as ArrayBuffer, "application/json");
}

export async function cfGetJson<T>(key: string): Promise<T | null> {
  try {
    const res = await client.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
    const text = await res.Body?.transformToString();
    if (!text) return null;
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export async function cfListObjects(
  prefix: string,
  opts: { limit?: number; cursor?: string } = {}
): Promise<{ objects: { key: string; uploaded: string }[]; nextCursor: string | null }> {
  const input: ListObjectsV2CommandInput = {
    Bucket: BUCKET,
    Prefix: prefix,
    MaxKeys: opts.limit ?? 500,
  };
  if (opts.cursor) input.ContinuationToken = opts.cursor;

  const res = await client.send(new ListObjectsV2Command(input));
  return {
    objects: (res.Contents ?? []).map((o) => ({
      key: o.Key!,
      uploaded: o.LastModified?.toISOString() ?? new Date().toISOString(),
    })),
    nextCursor: res.NextContinuationToken ?? null,
  };
}
