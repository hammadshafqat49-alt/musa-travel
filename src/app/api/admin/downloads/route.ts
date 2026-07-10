import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getAllDownloadsAdmin, createDownload, updateDownload, deleteDownload } from "@/lib/admin-data";

export async function GET() {
  try {
    await requireAdmin();
<<<<<<< HEAD
    const downloads = await getAllDownloadsAdmin();
=======
    const downloads = getAllDownloadsAdmin();
>>>>>>> 3cb85c9347b0bcd7c81e1b3ecd59cf1a0c6c8c5e
    return NextResponse.json({ downloads });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const data = await request.json();
<<<<<<< HEAD
    const result = await createDownload(data);
=======
    const result = createDownload(data);
>>>>>>> 3cb85c9347b0bcd7c81e1b3ecd59cf1a0c6c8c5e
    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create download" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const data = await request.json();
<<<<<<< HEAD
    await updateDownload(data.id, data);
=======
    updateDownload(data.id, data);
>>>>>>> 3cb85c9347b0bcd7c81e1b3ecd59cf1a0c6c8c5e
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
<<<<<<< HEAD
    await deleteDownload(Number(id));
=======
    deleteDownload(Number(id));
>>>>>>> 3cb85c9347b0bcd7c81e1b3ecd59cf1a0c6c8c5e
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete download" }, { status: 500 });
  }
}
