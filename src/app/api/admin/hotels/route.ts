import { NextResponse } from "next/server";
import { requirePermission, adminErrorResponse } from "@/lib/admin-auth";
import { getAllHotels, createHotel, updateHotel, deleteHotel } from "@/lib/admin-data";

export async function GET() {
  try {
    await requirePermission('hotels');
    const hotels = await getAllHotels();
    return NextResponse.json({ hotels });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    await requirePermission('hotels');
    const data = await request.json();
    const result = await createHotel(data);
    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}

export async function PUT(request: Request) {
  try {
    await requirePermission('hotels');
    const data = await request.json();
    await updateHotel(data.id, data);
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
    await deleteHotel(Number(id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}
