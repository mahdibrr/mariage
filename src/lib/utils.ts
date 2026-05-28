import { nanoid } from "nanoid";

export function generatePhotoId(): string {
  return nanoid(12);
}

export function buildPhotoKey(id: string, ext: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `photos/${year}/${month}/${Date.now()}-${id}.${ext}`;
}

export function buildMetadataKey(id: string): string {
  return `metadata/${id}.json`;
}

export function getFileExtension(mimeType: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/heic": "heic",
    "image/heif": "heif",
  };
  return map[mimeType] ?? "jpg";
}
