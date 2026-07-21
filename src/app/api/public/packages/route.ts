import { NextResponse } from "next/server";
import { getUmrahPackages } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const packages = await getUmrahPackages();
    return NextResponse.json(
      { packages },
      { headers: { "Cache-Control": "no-store, must-revalidate" } }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}
