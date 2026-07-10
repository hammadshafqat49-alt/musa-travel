import { NextResponse } from "next/server";
import { getHotelRates } from "@/lib/data";

export async function GET() {
  try {
    const rates = getHotelRates();
    return NextResponse.json({ rates });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}
