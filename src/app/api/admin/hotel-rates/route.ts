import { NextResponse } from "next/server";
import { requirePermission, adminErrorResponse } from "@/lib/admin-auth";
import { getAllHotelRates, createHotelRate, updateHotelRate, deleteHotelRate } from "@/lib/admin-data";

export async function GET() {
  try {
    await requirePermission('hotels');
    const rates = await getAllHotelRates();
    return NextResponse.json({ rates });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    await requirePermission('hotels');
    const data = await request.json();
    const result = await createHotelRate(data);
    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}

export async function PUT(request: Request) {
  try {
    await requirePermission('hotels');
    const data = await request.json();
    await updateHotelRate(data.id, data);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}

export async function DELETE(request: Request) {
  try {
    await requirePermission('hotels');
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await deleteHotelRate(Number(id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}
