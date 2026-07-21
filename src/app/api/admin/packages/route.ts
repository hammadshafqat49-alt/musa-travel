import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requirePermission, adminErrorResponse } from "@/lib/admin-auth";
import { getAllUmrahPackages, createUmrahPackage, updateUmrahPackage, deleteUmrahPackage } from "@/lib/admin-data";

export async function GET() {
  try {
    await requirePermission('packages');
    const packages = await getAllUmrahPackages();
    return NextResponse.json({ packages });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}

function revalidatePackagePaths() {
  revalidatePath("/admin/packages");
  revalidatePath("/");
  revalidatePath("/umrah-packages");
  revalidatePath("/agent");
  revalidatePath("/agent/packages");
  revalidatePath("/agent/bookings/package");
  revalidatePath("/agent/bookings/all-packages");
}

export async function POST(request: Request) {
  try {
    await requirePermission('packages');
    const data = await request.json();
    const result = await createUmrahPackage(data);
    revalidatePackagePaths();
    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error: any) {
    console.error("POST /api/admin/packages failed:", error);
    return NextResponse.json({ error: error.message || "Failed to create package" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await requirePermission('packages');
    const data = await request.json();
    await updateUmrahPackage(data.id, data);
    revalidatePackagePaths();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("PUT /api/admin/packages failed:", error);
    return NextResponse.json({ error: error.message || "Failed to update package" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requirePermission('packages');
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await deleteUmrahPackage(Number(id));
    revalidatePackagePaths();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/admin/packages failed:", error);
    return NextResponse.json({ error: error.message || "Failed to delete package" }, { status: 500 });
  }
}
