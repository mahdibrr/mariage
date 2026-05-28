import { NextRequest, NextResponse } from "next/server";
import { cfUpload, cfPutJson } from "@/lib/r2";
import { nanoid } from "nanoid";
import type { PhotoMetadata } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "ما كانش ملف" }, { status: 400 });

    const ext = (file.type.split("/")[1] ?? "jpg").replace("jpeg", "jpg");
    const key = `wedding/${Date.now()}-${nanoid(8)}.${ext}`;

    const bytes = await file.arrayBuffer();
    await cfUpload(key, bytes, file.type || "image/jpeg");

    const width = Number(form.get("width") ?? 0);
    const height = Number(form.get("height") ?? 0);

    const meta: PhotoMetadata = {
      id: key,
      url: `/api/image/${key}`,
      width,
      height,
      aspectRatio: width && height ? height / width : 1,
      timestamp: new Date().toISOString(),
    };

    await cfPutJson(`meta/${key}.json`, meta);

    return NextResponse.json({ ok: true, photo: meta });
  } catch (err) {
    console.error("upload error:", err);
    return NextResponse.json({ error: "فشل التحميل" }, { status: 500 });
  }
}
