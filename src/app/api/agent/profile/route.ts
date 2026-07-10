import { NextResponse } from "next/server";
import { requireAgent } from "@/lib/auth";
import { updateAgentProfile } from "@/lib/data";

export async function POST(request: Request) {
  try {
    const agent = await requireAgent();
    const formData = await request.formData();

<<<<<<< HEAD
    await updateAgentProfile(Number(agent.id), {
=======
    updateAgentProfile(Number(agent.id), {
>>>>>>> 3cb85c9347b0bcd7c81e1b3ecd59cf1a0c6c8c5e
      agency_name: formData.get("agency_name") as string,
      contact_person: formData.get("contact_person") as string,
      phone: formData.get("phone") as string,
      city: formData.get("city") as string,
      country: formData.get("country") as string,
    });

    return NextResponse.redirect(new URL("/agent", request.url));
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
