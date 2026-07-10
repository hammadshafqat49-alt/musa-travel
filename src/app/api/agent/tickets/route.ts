import { NextResponse } from "next/server";
import { requireAgent } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    await requireAgent();
<<<<<<< HEAD
    const tickets = await db
=======
    const tickets = db
>>>>>>> 3cb85c9347b0bcd7c81e1b3ecd59cf1a0c6c8c5e
      .prepare("SELECT * FROM tickets WHERE status = 'active' ORDER BY departure_date ASC")
      .all();
    return NextResponse.json({ tickets });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unauthorized" }, { status: 401 });
  }
}