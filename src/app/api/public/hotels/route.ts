import { NextResponse } from "next/server";
import { getHotels } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const hotels = await getHotels();
    return NextResponse.json(
      { hotels },
      { headers: { "Cache-Control": "no-store, must-revalidate" } }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}
