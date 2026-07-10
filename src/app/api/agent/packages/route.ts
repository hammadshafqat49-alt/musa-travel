import { NextResponse } from "next/server";
import { requireAgent } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const agent = await requireAgent();
    const packages = await db
      .prepare("SELECT * FROM umrah_packages WHERE agent_id = ? ORDER BY departure_date DESC")
      .all(agent.id);
    return NextResponse.json({ packages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const agent = await requireAgent();
    const data = await request.json();

    const stmt = db.prepare(`
      INSERT INTO umrah_packages (
        title, airline, departure_date, return_date, days, price, visa_price,
        hotel_makkah, hotel_madina, status, image_url,
        sharing_price, double_price, triple_price, quad_price, quint_price, agent_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = await stmt.run(
      data.title,
      data.airline,
      data.departure_date,
      data.return_date,
      Number(data.days) || 0,
      Number(data.price) || 0,
      Number(data.visa_price) || 0,
      data.hotel_makkah || "",
      data.hotel_madina || "",
      "active",
      data.image_url || "",
      Number(data.sharing_price) || 0,
      Number(data.double_price) || 0,
      Number(data.triple_price) || 0,
      Number(data.quad_price) || 0,
      Number(data.quint_price) || 0,
      agent.id
    );

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const agent = await requireAgent();
    const data = await request.json();
    const { id, ...fields } = data;

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    // Verify the package belongs to this agent
    const existing = await db.prepare("SELECT * FROM umrah_packages WHERE id = ? AND agent_id = ?").get(id, agent.id) as any;
    if (!existing) {
      return NextResponse.json({ error: "Package not found or not owned by you" }, { status: 403 });
    }

    const stmt = db.prepare(`
      UPDATE umrah_packages SET
        title = ?, airline = ?, departure_date = ?, return_date = ?, days = ?,
        price = ?, visa_price = ?, hotel_makkah = ?, hotel_madina = ?,
        image_url = ?, sharing_price = ?, double_price = ?, triple_price = ?, quad_price = ?, quint_price = ?
      WHERE id = ? AND agent_id = ?
    `);
    await stmt.run(
      fields.title,
      fields.airline,
      fields.departure_date,
      fields.return_date,
      Number(fields.days) || 0,
      Number(fields.price) || 0,
      Number(fields.visa_price) || 0,
      fields.hotel_makkah || "",
      fields.hotel_madina || "",
      fields.image_url || "",
      Number(fields.sharing_price) || 0,
      Number(fields.double_price) || 0,
      Number(fields.triple_price) || 0,
      Number(fields.quad_price) || 0,
      Number(fields.quint_price) || 0,
      id,
      agent.id
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const agent = await requireAgent();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const existing = await db.prepare("SELECT * FROM umrah_packages WHERE id = ? AND agent_id = ?").get(Number(id), agent.id) as any;
    if (!existing) {
      return NextResponse.json({ error: "Package not found or not owned by you" }, { status: 403 });
    }

    await db.prepare("DELETE FROM umrah_packages WHERE id = ? AND agent_id = ?").run(Number(id), agent.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}
