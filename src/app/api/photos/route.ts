import { NextRequest, NextResponse } from "next/server";
import { cfListObjects, cfGetJson } from "@/lib/r2";
import type { PhotoMetadata } from "@/lib/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor") ?? undefined;
    const limit = Math.min(Number(searchParams.get("limit") ?? 30), 60);

    const { objects, nextCursor } = await cfListObjects("meta/", {
      limit,
      cursor,
    });

    const photos = (
      await Promise.all(
        objects
          .filter((o) => o.key.endsWith(".json"))
          .map((o) => cfGetJson<PhotoMetadata>(o.key))
      )
    )
      .filter((p): p is PhotoMetadata => p !== null)
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

    return NextResponse.json({ photos, nextCursor: nextCursor ?? null });
  } catch (err) {
    console.error("photos list error:", err);
    return NextResponse.json({ error: "فشل تحميل الصور" }, { status: 500 });
  }
}
