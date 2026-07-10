import { db } from "../src/lib/db";

async function main() {
  try {
    console.log("Checking Turso database...\n");

    const tables = await db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();
    console.log("Tables found:", tables.map((t: any) => t.name));

    const agents = await db.prepare("SELECT COUNT(*) as count FROM agents").get() as any;
    console.log("Agents count:", agents?.count ?? 0);

    const packages = await db.prepare("SELECT COUNT(*) as count FROM umrah_packages").get() as any;
    console.log("Packages count:", packages?.count ?? 0);

    const bookings = await db.prepare("SELECT COUNT(*) as count FROM bookings").get() as any;
    console.log("Bookings count:", bookings?.count ?? 0);

    const tickets = await db.prepare("SELECT COUNT(*) as count FROM tickets").get() as any;
    console.log("Tickets count:", tickets?.count ?? 0);

    const admins = await db.prepare("SELECT COUNT(*) as count FROM admins").get() as any;
    console.log("Admins count:", admins?.count ?? 0);

    const hotels = await db.prepare("SELECT COUNT(*) as count FROM hotels").get() as any;
    console.log("Hotels count:", hotels?.count ?? 0);

    console.log("\nDatabase is populated!");
  } catch (err: any) {
    console.error("Check failed:", err.message);
  }
}

main();
