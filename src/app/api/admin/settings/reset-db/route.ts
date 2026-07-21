import { NextResponse } from "next/server";
import { requirePermission, adminErrorResponse } from "@/lib/admin-auth";
import { initDb, seedDb } from "@/lib/db";

export async function POST() {
  try {
    await requirePermission('settings');
    await initDb();
    await seedDb();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}
