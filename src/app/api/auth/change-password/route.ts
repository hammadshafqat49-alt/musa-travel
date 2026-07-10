import { NextResponse } from "next/server";
import { requireAgent } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const agent = await requireAgent();
    const { current, new: newPass } = await request.json();

<<<<<<< HEAD
    const existing = await db.prepare("SELECT * FROM agents WHERE id = ? AND password = ?").get(Number(agent.id), current) as any;
=======
    const existing = db.prepare("SELECT * FROM agents WHERE id = ? AND password = ?").get(Number(agent.id), current) as any;
>>>>>>> 3cb85c9347b0bcd7c81e1b3ecd59cf1a0c6c8c5e
    if (!existing) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }

<<<<<<< HEAD
    await db.prepare("UPDATE agents SET password = ? WHERE id = ?").run(newPass, Number(agent.id));
=======
    db.prepare("UPDATE agents SET password = ? WHERE id = ?").run(newPass, Number(agent.id));
>>>>>>> 3cb85c9347b0bcd7c81e1b3ecd59cf1a0c6c8c5e
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}
