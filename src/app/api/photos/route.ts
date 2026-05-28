import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import type { PhotoMetadata } from "@/lib/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor") ?? undefined;
    const limit = Math.min(Number(searchParams.get("limit") ?? 30), 60);

    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "wedding/",
      max_results: limit,
      next_cursor: cursor,
      context: true,
      direction: "desc",
    });

    const photos: PhotoMetadata[] = result.resources.map(
      (r: {
        public_id: string;
        secure_url: string;
        width: number;
        height: number;
        created_at: string;
        context?: { custom?: { uploaderName?: string } };
      }) => ({
        id: r.public_id,
        url: r.secure_url,
        width: r.width,
        height: r.height,
        aspectRatio: r.height / r.width,
        timestamp: r.created_at,
        uploaderName: r.context?.custom?.uploaderName,
      })
    );

    return NextResponse.json({
      photos,
      nextCursor: result.next_cursor ?? null,
    });
  } catch (err) {
    console.error("photos list error:", err);
    return NextResponse.json({ error: "فشل تحميل الصور" }, { status: 500 });
  }
}
