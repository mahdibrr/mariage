import { NextResponse } from "next/server";

// Returns Cloudinary config for direct unsigned upload from browser
export async function GET() {
  return NextResponse.json({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
    folder: "wedding",
  });
}
