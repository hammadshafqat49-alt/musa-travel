import { NextResponse } from "next/server";
import { requirePermission, adminErrorResponse } from "@/lib/admin-auth";
import { getAllUmrahGroups, createUmrahGroup, updateUmrahGroup, deleteUmrahGroup } from "@/lib/admin-data";

export async function GET() {
  try {
    await requirePermission('umrah_groups');
    const groups = await getAllUmrahGroups();
    return NextResponse.json({ groups });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    await requirePermission('umrah_groups');
    const data = await request.json();
    const result = await createUmrahGroup(data);
    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}

export async function PUT(request: Request) {
  try {
    await requirePermission('umrah_groups');
    const data = await request.json();
    await updateUmrahGroup(data.id, data);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}

export async function DELETE(request: Request) {
  try {
    await requirePermission('umrah_groups');
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await deleteUmrahGroup(Number(id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}
