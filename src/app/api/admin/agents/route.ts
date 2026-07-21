import { NextResponse } from "next/server";
import { requirePermission, adminErrorResponse } from "@/lib/admin-auth";
import { getAllAgents, createAgent, updateAgent, deleteAgent } from "@/lib/admin-data";

export async function GET() {
  try {
    await requirePermission('agents');
    const agents = await getAllAgents();
    return NextResponse.json({ agents });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    await requirePermission('agents');
    const data = await request.json();
    const result = await createAgent(data);
    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}

export async function PUT(request: Request) {
  try {
    await requirePermission('agents');
    const data = await request.json();
    await updateAgent(data.id, data);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}

export async function DELETE(request: Request) {
  try {
    await requirePermission('agents');
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await deleteAgent(Number(id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}
