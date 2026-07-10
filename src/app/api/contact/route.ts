import { NextResponse } from "next/server";
import { createContact } from "@/lib/data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Name, email, subject and message are required" },
        { status: 400 }
      );
    }

    await createContact({ name, email, phone: phone || "", subject, message });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to send message" },
      { status: 500 }
    );
  }
}
