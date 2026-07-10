import { NextResponse } from "next/server";
import { getUmrahGroups } from "@/lib/data";

export async function GET() {
  try {
    const groups = getUmrahGroups();
    return NextResponse.json({ groups });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}
