import { NextResponse } from "next/server";
import { requireAgent } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const agent = await requireAgent();
    const formData = await request.formData();

    const amount = Number(formData.get("amount"));
    const method = formData.get("method") as string;
    const reference = formData.get("reference") as string;
    const notes = formData.get("notes") as string;

    await db.prepare(`
      INSERT INTO payments (agent_id, amount, method, status, reference, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(Number(agent.id), amount, method, "pending", reference, notes);

    return NextResponse.redirect(new URL("/agent/payments", request.url));
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}
