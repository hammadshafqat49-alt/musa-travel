import { NextResponse } from "next/server";
import { getUmrahGroups } from "@/lib/data";

export async function GET() {
  try {
<<<<<<< HEAD
    const groups = await getUmrahGroups();
=======
    const groups = getUmrahGroups();
>>>>>>> 3cb85c9347b0bcd7c81e1b3ecd59cf1a0c6c8c5e
    return NextResponse.json({ groups });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}
