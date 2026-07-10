import { NextResponse } from "next/server";
import { getUmrahPackages } from "@/lib/data";

export async function GET() {
  try {
<<<<<<< HEAD
    const packages = await getUmrahPackages();
=======
    const packages = getUmrahPackages();
>>>>>>> 3cb85c9347b0bcd7c81e1b3ecd59cf1a0c6c8c5e
    return NextResponse.json({ packages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}
