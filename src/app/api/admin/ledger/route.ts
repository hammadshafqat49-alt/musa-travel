import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getAllBookingsWithDetails, deleteLedgerEntry, getAllLedgerAdmin } from "@/lib/admin-data";

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const view = searchParams.get("view");

    if (view === "bookings") {
      const bookings = getAllBookingsWithDetails();
      return NextResponse.json({ bookings });
    }

    const entries = getAllLedgerAdmin();
    return NextResponse.json({ entries });
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
    deleteLedgerEntry(Number(id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete entry" }, { status: 500 });
  }
}
