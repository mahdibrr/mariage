import { NextRequest, NextResponse } from "next/server";
import { listObjects, getJsonObject } from "@/lib/r2";
import { buildMetadataKey } from "@/lib/utils";
import type { PhotoMetadata } from "@/lib/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor") ?? undefined;
    const limit = Math.min(Number(searchParams.get("limit") ?? 30), 60);

    const listRes = await listObjects("metadata/", {
      maxKeys: 200,
      continuationToken: cursor,
    });

    const keys = (listRes.Contents ?? []).map((o) => o.Key!).filter(Boolean);

    const BATCH = 20;
    const photos: PhotoMetadata[] = [];
    for (let i = 0; i < keys.length; i += BATCH) {
      const batch = keys.slice(i, i + BATCH);
      const results = await Promise.all(
        batch.map((k) => {
          const id = k.replace("metadata/", "").replace(".json", "");
          return getJsonObject<PhotoMetadata>(buildMetadataKey(id));
        })
      );
      photos.push(...(results.filter(Boolean) as PhotoMetadata[]));
    }

    photos.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json({
      photos: photos.slice(0, limit),
      nextCursor: listRes.NextContinuationToken ?? null,
    });
  } catch (err) {
    console.error("photos list error:", err);
    return NextResponse.json({ error: "فشل تحميل الصور" }, { status: 500 });
  }
}
