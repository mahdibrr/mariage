import { NextRequest, NextResponse } from "next/server";
import { cfGetObject } from "@/lib/r2";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const key = path.join("/");

  const upstream = await cfGetObject(key);
  if (!upstream.ok) return new NextResponse(null, { status: 404 });

  const contentType = upstream.headers.get("Content-Type") ?? "image/jpeg";

  return new NextResponse(upstream.body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
