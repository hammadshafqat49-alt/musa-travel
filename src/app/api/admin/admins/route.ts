import { NextResponse } from "next/server";
import { requirePermission, adminErrorResponse } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    await requirePermission('settings');
    const admins = await db.prepare("SELECT id, username, email, name, role, created_at FROM admins ORDER BY created_at DESC").all();
    return NextResponse.json({ admins });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    await requirePermission('settings');
    const { username, email, password, name, role } = await request.json();
    if (!username || !email || !password) {
      return NextResponse.json({ error: "Username, email and password are required" }, { status: 400 });
    }
    const assignedRole = role || "admin";
    const roleExists = await db.prepare("SELECT name FROM roles WHERE name = ?").get(assignedRole);
    if (!roleExists) {
      return NextResponse.json({ error: "Selected role does not exist" }, { status: 400 });
    }
    const result = await db.prepare("INSERT INTO admins (username, email, password, name, role) VALUES (?, ?, ?, ?, ?)").run(username, email, password, name || "", assignedRole);
    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}

export async function PUT(request: Request) {
  try {
    await requirePermission('settings');
    const { id, username, email, name, role, password } = await request.json();
    if (!id || !username || !email) {
      return NextResponse.json({ error: "ID, username and email are required" }, { status: 400 });
    }
    const assignedRole = role || "admin";
    const roleExists = await db.prepare("SELECT name FROM roles WHERE name = ?").get(assignedRole);
    if (!roleExists) {
      return NextResponse.json({ error: "Selected role does not exist" }, { status: 400 });
    }
    if (password && password.trim() !== "") {
      await db.prepare("UPDATE admins SET username = ?, email = ?, password = ?, name = ?, role = ? WHERE id = ?").run(username, email, password, name || "", assignedRole, id);
    } else {
      await db.prepare("UPDATE admins SET username = ?, email = ?, name = ?, role = ? WHERE id = ?").run(username, email, name || "", assignedRole, id);
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}

export async function DELETE(request: Request) {
  try {
    await requirePermission('settings');
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }
    await db.prepare("DELETE FROM admins WHERE id = ?").run(Number(id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}
