import { NextResponse } from "next/server";
import { requirePermission, adminErrorResponse } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const admin = await requirePermission('settings');
    const { currentPassword, username, email, newPassword, confirmPassword } = await request.json();

    const existing = await db.prepare("SELECT * FROM admins WHERE id = ? AND password = ?").get(Number(admin.id), currentPassword) as any;
    if (!existing) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }

    if (newPassword && newPassword !== confirmPassword) {
      return NextResponse.json({ error: "New passwords do not match" }, { status: 400 });
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (username && username !== existing.username) {
      const dup = await db.prepare("SELECT id FROM admins WHERE username = ? AND id != ?").get(username, Number(admin.id)) as any;
      if (dup) {
        return NextResponse.json({ error: "Username already taken" }, { status: 400 });
      }
      updates.push("username = ?");
      values.push(username);
    }

    if (email && email !== existing.email) {
      const dup = await db.prepare("SELECT id FROM admins WHERE email = ? AND id != ?").get(email, Number(admin.id)) as any;
      if (dup) {
        return NextResponse.json({ error: "Email already taken" }, { status: 400 });
      }
      updates.push("email = ?");
      values.push(email);
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
      }
      updates.push("password = ?");
      values.push(newPassword);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "No changes provided" }, { status: 400 });
    }

    values.push(Number(admin.id));
    await db.prepare(`UPDATE admins SET ${updates.join(", ")} WHERE id = ?`).run(...values);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}
