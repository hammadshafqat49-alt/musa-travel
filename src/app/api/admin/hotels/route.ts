import { NextResponse } from "next/server";
import { requirePermission, adminErrorResponse } from "@/lib/admin-auth";
import { getAllHotels, createHotel, updateHotel, deleteHotel } from "@/lib/admin-data";
import { initDb } from "@/lib/db";

export async function GET() {
  try {
    await initDb();
    await requirePermission('hotels');
    const hotels = await getAllHotels();
    return NextResponse.json({ hotels });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    await initDb();
    await requirePermission('hotels');
    const data = await request.json();
    if (!data.name || !data.city) {
      return NextResponse.json({ error: "Name and city are required" }, { status: 400 });
    }
    const result = await createHotel(data);
    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error: any) {
    console.error("POST /api/admin/hotels failed:", error);
    return NextResponse.json({ error: error.message || "Failed to create hotel" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await initDb();
    await requirePermission('hotels');
    const data = await request.json();
    if (!data.id || !data.name || !data.city) {
      return NextResponse.json({ error: "ID, name and city are required" }, { status: 400 });
    }
    await updateHotel(data.id, data);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("PUT /api/admin/hotels failed:", error);
    return NextResponse.json({ error: error.message || "Failed to update hotel" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await initDb();
    await requirePermission('hotels');
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await deleteHotel(Number(id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/admin/hotels failed:", error);
    return NextResponse.json({ error: error.message || "Failed to delete hotel" }, { status: 500 });
  }
}
