import { NextResponse } from "next/server";
import { requireAgent } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    await requireAgent();
    const tickets = await db
      .prepare("SELECT * FROM tickets WHERE status = 'active' ORDER BY departure_date ASC")
      .all();
    return NextResponse.json({ tickets });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unauthorized" }, { status: 401 });
  }
}