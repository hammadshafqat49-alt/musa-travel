import { NextResponse } from "next/server";
import { getAdminWithPermissions } from "@/lib/admin-auth";

export async function GET() {
  try {
    const { admin, permissions } = await getAdminWithPermissions();
    return NextResponse.json({
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
      permissions,
    });
  } catch (error: any) {
    const status = error.message === "Forbidden" ? 403 : 401;
    return NextResponse.json({ error: error.message || "Unauthorized" }, { status });
  }
}
