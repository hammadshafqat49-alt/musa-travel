import { NextResponse } from "next/server";
import { requireAgent } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const agent = await requireAgent();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    let sql = 'SELECT * FROM bookings WHERE agent_id = ?';
    const params: any[] = [agent.id];
    if (type) { sql += ' AND type = ?'; params.push(type); }
    sql += ' ORDER BY created_at DESC';
    const bookings = db.prepare(sql).all(...params);
    return NextResponse.json({ bookings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const agent = await requireAgent();
    const formData = await request.formData();

    const type = formData.get("type") as string;
    const group_id = formData.get("group_id") ? Number(formData.get("group_id")) : null;
    const package_id = formData.get("package_id") ? Number(formData.get("package_id")) : null;
    const ticket_id = formData.get("ticket_id") ? Number(formData.get("ticket_id")) : null;
    const adults = Number(formData.get("adults") || 1);
    const infants = Number(formData.get("infants") || 0);

    const roomType = (formData.get("room_type") as string) || "";

    let totalAmount = 0;
    if (ticket_id) {
      const ticket = db.prepare("SELECT price, available_seats FROM tickets WHERE id = ? AND status = 'active'").get(ticket_id) as any;
      if (!ticket) {
        return NextResponse.json({ error: "Ticket not found or inactive" }, { status: 400 });
      }
      if (Number(ticket.available_seats) < adults) {
        return NextResponse.json({ error: "Not enough seats available" }, { status: 400 });
      }
      totalAmount = (ticket?.price || 0) * adults;
    } else if (group_id) {
      let group;
      if (type === "umrah") {
        group = db.prepare("SELECT price FROM umrah_groups WHERE id = ?").get(group_id) as any;
      } else {
        group = db.prepare("SELECT price FROM one_way_groups WHERE id = ?").get(group_id) as any;
      }
      totalAmount = (group?.price || 0) * adults;
    } else if (package_id) {
      const pkg = db.prepare("SELECT price, sharing_price, double_price, triple_price, quad_price, quint_price FROM umrah_packages WHERE id = ?").get(package_id) as any;
      let unitPrice = pkg?.price || 0;
      if (roomType === "sharing") unitPrice = pkg?.sharing_price || pkg?.price || 0;
      else if (roomType === "double") unitPrice = pkg?.double_price || pkg?.price || 0;
      else if (roomType === "triple") unitPrice = pkg?.triple_price || pkg?.price || 0;
      else if (roomType === "quad") unitPrice = pkg?.quad_price || pkg?.price || 0;
      else if (roomType === "quint") unitPrice = pkg?.quint_price || pkg?.price || 0;
      totalAmount = unitPrice * adults;
    }

    const refId = "REF-" + Math.random().toString(36).substring(2, 8).toUpperCase();

    db.prepare(`
      INSERT INTO bookings (agent_id, type, reference_id, package_id, group_id, ticket_id, adults, infants, total_amount, status, room_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(Number(agent.id), type, refId, package_id, group_id, ticket_id, adults, infants, totalAmount, "pending", roomType);

    if (ticket_id) {
      db.prepare("UPDATE tickets SET available_seats = available_seats - ? WHERE id = ?").run(adults, ticket_id);
    }

    return NextResponse.json({ success: true, reference_id: refId, total_amount: totalAmount });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}
