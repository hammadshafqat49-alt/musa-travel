import { NextResponse } from "next/server";
import { requirePermission, adminErrorResponse } from "@/lib/admin-auth";
import { getAllBookingsWithDetails, deleteLedgerEntry, getAllLedgerAdmin } from "@/lib/admin-data";

export async function GET(request: Request) {
  try {
    await requirePermission('ledger');
    const { searchParams } = new URL(request.url);
    const view = searchParams.get("view");

    if (view === "bookings") {
      const bookings = await getAllBookingsWithDetails();
      return NextResponse.json({ bookings });
    }

    const entries = await getAllLedgerAdmin();
    return NextResponse.json({ entries });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}

export async function DELETE(request: Request) {
  try {
    await requirePermission('ledger');
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await deleteLedgerEntry(Number(id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}
