import { NextResponse } from "next/server";

// Kept for backward compatibility — upload now goes via /api/upload
export async function GET() {
  return NextResponse.json({ ok: true });
}
