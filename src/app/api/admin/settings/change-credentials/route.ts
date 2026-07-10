import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    const { currentPassword, username, email, newPassword, confirmPassword } = await request.json();

<<<<<<< HEAD
    const existing = await db.prepare("SELECT * FROM admins WHERE id = ? AND password = ?").get(Number(admin.id), currentPassword) as any;
=======
    const existing = db.prepare("SELECT * FROM admins WHERE id = ? AND password = ?").get(Number(admin.id), currentPassword) as any;
>>>>>>> 3cb85c9347b0bcd7c81e1b3ecd59cf1a0c6c8c5e
    if (!existing) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }

    if (newPassword && newPassword !== confirmPassword) {
      return NextResponse.json({ error: "New passwords do not match" }, { status: 400 });
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (username && username !== existing.username) {
<<<<<<< HEAD
      const dup = await db.prepare("SELECT id FROM admins WHERE username = ? AND id != ?").get(username, Number(admin.id)) as any;
=======
      const dup = db.prepare("SELECT id FROM admins WHERE username = ? AND id != ?").get(username, Number(admin.id)) as any;
>>>>>>> 3cb85c9347b0bcd7c81e1b3ecd59cf1a0c6c8c5e
      if (dup) {
        return NextResponse.json({ error: "Username already taken" }, { status: 400 });
      }
      updates.push("username = ?");
      values.push(username);
    }

    if (email && email !== existing.email) {
<<<<<<< HEAD
      const dup = await db.prepare("SELECT id FROM admins WHERE email = ? AND id != ?").get(email, Number(admin.id)) as any;
=======
      const dup = db.prepare("SELECT id FROM admins WHERE email = ? AND id != ?").get(email, Number(admin.id)) as any;
>>>>>>> 3cb85c9347b0bcd7c81e1b3ecd59cf1a0c6c8c5e
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
<<<<<<< HEAD
    await db.prepare(`UPDATE admins SET ${updates.join(", ")} WHERE id = ?`).run(...values);
=======
    db.prepare(`UPDATE admins SET ${updates.join(", ")} WHERE id = ?`).run(...values);
>>>>>>> 3cb85c9347b0bcd7c81e1b3ecd59cf1a0c6c8c5e

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update credentials" }, { status: 500 });
  }
}
