import { NextResponse } from "next/server";

// No-op — metadata is now stored during /api/upload
export async function POST() {
  return NextResponse.json({ ok: true });
}
