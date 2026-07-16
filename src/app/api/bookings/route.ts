import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createClientBooking } from "@/lib/data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      type,
      package_id,
      group_id,
      adults = 1,
      children = 0,
      infants = 0,
      room_type,
      transport_included = false,
      client_name,
      client_phone,
      client_email,
    } = body;

    if (!client_name || !client_phone) {
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 }
      );
    }

    let totalAmount = 0;

    if (type === "package" && package_id) {
      const pkg = await db
        .prepare(
          "SELECT price, sharing_price, double_price, triple_price, quad_price FROM umrah_packages WHERE id = ?"
        )
        .get(package_id) as any;
      if (!pkg) {
        return NextResponse.json(
          { error: "Package not found" },
          { status: 404 }
        );
      }
      let unitPrice = pkg.price || 0;
      if (room_type === "sharing") unitPrice = pkg.sharing_price || pkg.price || 0;
      else if (room_type === "double") unitPrice = pkg.double_price || pkg.price || 0;
      else if (room_type === "triple") unitPrice = pkg.triple_price || pkg.price || 0;
      else if (room_type === "quad") unitPrice = pkg.quad_price || pkg.price || 0;
      totalAmount = unitPrice * Number(adults);
    } else if (type === "umrah" && group_id) {
      const group = await db
        .prepare("SELECT price FROM umrah_groups WHERE id = ?")
        .get(group_id) as any;
      if (!group) {
        return NextResponse.json(
          { error: "Group not found" },
          { status: 404 }
        );
      }
      totalAmount = (group?.price || 0) * Number(adults);
    } else {
      return NextResponse.json(
        { error: "Invalid booking type or missing ID" },
        { status: 400 }
      );
    }

    const result = await createClientBooking({
      type,
      package_id,
      group_id,
      adults: Number(adults),
      children: Number(children),
      infants: Number(infants),
      total_amount: totalAmount,
      room_type,
      transport_included,
      client_name,
      client_phone,
      client_email,
    });

    return NextResponse.json({
      success: true,
      bookingId: result.lastInsertRowid,
      reference_id: result.lastInsertRowid
        ? `CLT-${String(result.lastInsertRowid).padStart(4, "0")}`
        : null,
      total_amount: totalAmount,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Booking failed" },
      { status: 500 }
    );
  }
}
