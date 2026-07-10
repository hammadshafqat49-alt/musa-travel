import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { initDb, seedDb } from "@/lib/db";

export async function POST() {
  try {
    await requireAdmin();
    await initDb();
    await seedDb();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to reset database" }, { status: 500 });
  }
}
