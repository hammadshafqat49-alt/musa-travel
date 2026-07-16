import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    await requireAdmin();
    const admins = await db.prepare("SELECT id, username, email, name, role, created_at FROM admins ORDER BY created_at DESC").all();
    return NextResponse.json({ admins });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const { username, email, password, name, role } = await request.json();
    if (!username || !email || !password) {
      return NextResponse.json({ error: "Username, email and password are required" }, { status: 400 });
    }
    const result = await db.prepare("INSERT INTO admins (username, email, password, name, role) VALUES (?, ?, ?, ?, ?)").run(username, email, password, name || "", role || "admin");
    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const { id, username, email, name, role, password } = await request.json();
    if (!id || !username || !email) {
      return NextResponse.json({ error: "ID, username and email are required" }, { status: 400 });
    }
    if (password && password.trim() !== "") {
      await db.prepare("UPDATE admins SET username = ?, email = ?, password = ?, name = ?, role = ? WHERE id = ?").run(username, email, password, name || "", role || "admin", id);
    } else {
      await db.prepare("UPDATE admins SET username = ?, email = ?, name = ?, role = ? WHERE id = ?").run(username, email, name || "", role || "admin", id);
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }
    await db.prepare("DELETE FROM admins WHERE id = ?").run(Number(id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}
