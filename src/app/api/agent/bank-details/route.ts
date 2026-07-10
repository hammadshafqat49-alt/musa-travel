import { NextResponse } from "next/server";
import { requireAgent } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const agent = await requireAgent();
    const formData = await request.formData();

    const bank_name = formData.get("bank_name") as string;
    const account_title = formData.get("account_title") as string;
    const account_number = formData.get("account_number") as string;
    const iban = formData.get("iban") as string;
    const branch = formData.get("branch") as string;

<<<<<<< HEAD
    await db.prepare(`
=======
    db.prepare(`
>>>>>>> 3cb85c9347b0bcd7c81e1b3ecd59cf1a0c6c8c5e
      INSERT INTO bank_details (agent_id, bank_name, account_title, account_number, iban, branch)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(Number(agent.id), bank_name, account_title, account_number, iban, branch);

    return NextResponse.redirect(new URL("/agent/bank-details", request.url));
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}
