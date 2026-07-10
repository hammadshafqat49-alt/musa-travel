import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getAllBookings, updateBookingStatus, deleteBooking } from "@/lib/admin-data";

export async function GET() {
  try {
    await requireAdmin();
    const bookings = getAllBookings();
    return NextResponse.json({ bookings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const data = await request.json();
    updateBookingStatus(data.id, data.status);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update booking" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    deleteBooking(Number(id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete booking" }, { status: 500 });
  }
}
