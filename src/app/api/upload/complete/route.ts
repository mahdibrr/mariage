// No-op for Cloudinary: metadata (width, height, url) is returned
// directly by Cloudinary during upload. This route exists only
// to add the uploaderName tag after the upload completes.
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const { publicId, uploaderName } = await req.json();
    if (!publicId) return NextResponse.json({ ok: true });

    if (uploaderName?.trim()) {
      await cloudinary.uploader.add_context(
        `uploaderName=${uploaderName.trim().slice(0, 50)}`,
        [publicId]
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    // Non-critical — just return ok even if context update fails
    return NextResponse.json({ ok: true });
  }
}
