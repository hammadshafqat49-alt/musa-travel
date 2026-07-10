import { NextResponse } from "next/server";
import { getHotelRates } from "@/lib/data";

export async function GET() {
  try {
<<<<<<< HEAD
    const rates = await getHotelRates();
=======
    const rates = getHotelRates();
>>>>>>> 3cb85c9347b0bcd7c81e1b3ecd59cf1a0c6c8c5e
    return NextResponse.json({ rates });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}
