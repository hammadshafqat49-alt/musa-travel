import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { signAdminToken } from "@/lib/admin-auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const admin = await db.prepare("SELECT * FROM admins WHERE email = ? AND password = ?").get(email, password) as any;

    if (!admin) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = await signAdminToken({ id: admin.id, username: admin.username, email: admin.email, role: admin.role });
    const cookieStore = await cookies();
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return NextResponse.json({ success: true, admin: { id: admin.id, username: admin.username, email: admin.email, name: admin.name } });
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
