import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    await requireAdmin();
    const roles = await db.prepare("SELECT * FROM roles ORDER BY created_at DESC").all();
    return NextResponse.json({ roles });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const { name, permissions } = await request.json();
    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Role name is required" }, { status: 400 });
    }
    const perms = Array.isArray(permissions) ? JSON.stringify(permissions) : "[]";
    const result = await db.prepare("INSERT INTO roles (name, permissions) VALUES (?, ?)").run(name.trim(), perms);
    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const { id, name, permissions } = await request.json();
    if (!id || !name || name.trim() === "") {
      return NextResponse.json({ error: "ID and name are required" }, { status: 400 });
    }
    const perms = Array.isArray(permissions) ? JSON.stringify(permissions) : "[]";
    await db.prepare("UPDATE roles SET name = ?, permissions = ? WHERE id = ?").run(name.trim(), perms, id);
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
    await db.prepare("DELETE FROM roles WHERE id = ?").run(Number(id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}
