import { NextRequest, NextResponse } from "next/server";
import { putJsonObject } from "@/lib/r2";
import { buildMetadataKey } from "@/lib/utils";
import type { PhotoMetadata } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { id, key, publicUrl, width, height, uploaderName } = await req.json() as {
      id: string;
      key: string;
      publicUrl: string;
      width?: number;
      height?: number;
      uploaderName?: string;
    };

    if (!id || !key || !publicUrl) {
      return NextResponse.json({ error: "بيانات ناقصة" }, { status: 400 });
    }

    const metadata: PhotoMetadata = {
      id,
      key,
      url: publicUrl,
      width: width ?? 1080,
      height: height ?? 1080,
      aspectRatio: (height ?? 1080) / (width ?? 1080),
      timestamp: new Date().toISOString(),
      uploaderName: uploaderName?.trim().slice(0, 50) || undefined,
    };

    await putJsonObject(buildMetadataKey(id), metadata);

    return NextResponse.json({ success: true, photo: metadata });
  } catch (err) {
    console.error("upload complete error:", err);
    return NextResponse.json({ error: "فشل حفظ بيانات الصورة" }, { status: 500 });
  }
}
