import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { initDb, seedDb } from "@/lib/db";

export async function POST() {
  try {
    await requireAdmin();
<<<<<<< HEAD
    await initDb();
    await seedDb();
=======
    initDb();
    seedDb();
>>>>>>> 3cb85c9347b0bcd7c81e1b3ecd59cf1a0c6c8c5e
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to reset database" }, { status: 500 });
  }
}
