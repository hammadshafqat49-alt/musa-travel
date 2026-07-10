import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { signToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { code, email, password } = await request.json();

    const agent = await db.prepare("SELECT * FROM agents WHERE code = ? AND email = ? AND password = ?").get(code, email, password) as any;

    if (!agent) {
      return NextResponse.json({ error: "Invalid agent code, email or password" }, { status: 401 });
    }

    const token = await signToken({ id: agent.id, email: agent.email, code: agent.code });
    const cookieStore = await cookies();
    cookieStore.set("agent_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return NextResponse.json({ success: true, agent: { id: agent.id, email: agent.email, code: agent.code } });
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
