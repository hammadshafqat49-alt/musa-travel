import { NextResponse } from "next/server";
import { requireAgent } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const agent = await requireAgent();
    const { current, new: newPass } = await request.json();

    const existing = db.prepare("SELECT * FROM agents WHERE id = ? AND password = ?").get(Number(agent.id), current) as any;
    if (!existing) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }

    db.prepare("UPDATE agents SET password = ? WHERE id = ?").run(newPass, Number(agent.id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}
