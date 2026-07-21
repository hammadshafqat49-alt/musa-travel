import { NextResponse } from "next/server";
import { requirePermission, adminErrorResponse } from "@/lib/admin-auth";
import { getAllBookings, updateBookingStatus, deleteBooking } from "@/lib/admin-data";

export async function GET() {
  try {
    await requirePermission('bookings');
    const bookings = await getAllBookings();
    return NextResponse.json({ bookings });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}

export async function PUT(request: Request) {
  try {
    await requirePermission('bookings');
    const data = await request.json();
    await updateBookingStatus(data.id, data.status);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}

export async function DELETE(request: Request) {
  try {
    await requirePermission('bookings');
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await deleteBooking(Number(id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}
