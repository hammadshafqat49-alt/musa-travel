import { NextResponse } from "next/server";
import { getUmrahPackages } from "@/lib/data";

export async function GET() {
  try {
    const packages = await getUmrahPackages();
    return NextResponse.json({ packages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}
