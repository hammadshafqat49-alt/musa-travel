import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getAllContacts, deleteContact } from "@/lib/admin-data";

export async function GET() {
  try {
    await requireAdmin();
    const contacts = await getAllContacts();
    return NextResponse.json({ contacts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await deleteContact(Number(id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete contact" }, { status: 500 });
  }
}
