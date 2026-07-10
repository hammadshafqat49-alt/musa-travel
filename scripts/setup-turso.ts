import { initDb, seedDb } from "../src/lib/db";

async function main() {
  console.log("Creating tables...");
  await initDb();
  console.log("Seeding data...");
  await seedDb();
  console.log("Done! Turso database is ready.");
}

main().catch((err) => {
  console.error("Setup failed:", err);
  process.exit(1);
});
