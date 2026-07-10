import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getAllUmrahGroups, createUmrahGroup, updateUmrahGroup, deleteUmrahGroup } from "@/lib/admin-data";

export async function GET() {
  try {
    await requireAdmin();
<<<<<<< HEAD
    const groups = await getAllUmrahGroups();
=======
    const groups = getAllUmrahGroups();
>>>>>>> 3cb85c9347b0bcd7c81e1b3ecd59cf1a0c6c8c5e
    return NextResponse.json({ groups });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const data = await request.json();
<<<<<<< HEAD
    const result = await createUmrahGroup(data);
=======
    const result = createUmrahGroup(data);
>>>>>>> 3cb85c9347b0bcd7c81e1b3ecd59cf1a0c6c8c5e
    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create group" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const data = await request.json();
<<<<<<< HEAD
    await updateUmrahGroup(data.id, data);
=======
    updateUmrahGroup(data.id, data);
>>>>>>> 3cb85c9347b0bcd7c81e1b3ecd59cf1a0c6c8c5e
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update group" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
<<<<<<< HEAD
    await deleteUmrahGroup(Number(id));
=======
    deleteUmrahGroup(Number(id));
>>>>>>> 3cb85c9347b0bcd7c81e1b3ecd59cf1a0c6c8c5e
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete group" }, { status: 500 });
  }
}
