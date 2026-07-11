import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getAllHotelRates, createHotelRate, updateHotelRate, deleteHotelRate } from "@/lib/admin-data";

export async function GET() {
  try {
    await requireAdmin();
    const rates = await getAllHotelRates();
    return NextResponse.json({ rates });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const data = await request.json();
    const result = await createHotelRate(data);
    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create rate" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const data = await request.json();
    await updateHotelRate(data.id, data);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update rate" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await deleteHotelRate(Number(id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete rate" }, { status: 500 });
  }
}
