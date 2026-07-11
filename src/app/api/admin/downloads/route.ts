import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getAllDownloadsAdmin, createDownload, updateDownload, deleteDownload } from "@/lib/admin-data";

export async function GET() {
  try {
    await requireAdmin();
    const downloads = await getAllDownloadsAdmin();
    return NextResponse.json({ downloads });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const data = await request.json();
    const result = await createDownload(data);
    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create download" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const data = await request.json();
    await updateDownload(data.id, data);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update download" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await deleteDownload(Number(id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete download" }, { status: 500 });
  }
}
