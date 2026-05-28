import { NextRequest, NextResponse } from "next/server";
import { getPresignedUploadUrl, getPublicUrl } from "@/lib/r2";
import { generatePhotoId, buildPhotoKey, getFileExtension } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { contentType, fileName } = await req.json();

    if (!contentType || !contentType.startsWith("image/")) {
      return NextResponse.json(
        { error: "نوع الملف غير مدعوم" },
        { status: 400 }
      );
    }

    const id = generatePhotoId();
    const ext = getFileExtension(contentType);
    const key = buildPhotoKey(id, ext);
    const uploadUrl = await getPresignedUploadUrl(key, contentType);
    const publicUrl = getPublicUrl(key);

    return NextResponse.json({
      uploadUrl,
      photoId: id,
      key,
      publicUrl,
    });
  } catch (err) {
    console.error("presigned URL error:", err);
    return NextResponse.json(
      { error: "فشل إنشاء رابط الرفع" },
      { status: 500 }
    );
  }
}
