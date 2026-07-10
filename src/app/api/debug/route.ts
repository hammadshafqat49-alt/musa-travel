import { NextResponse } from "next/server";
import { db, initDb, seedDb } from "@/lib/db";

export async function GET() {
  const results: any = {
    env: {
      TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL ? "SET" : "MISSING",
      TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN ? "SET" : "MISSING",
      JWT_SECRET: process.env.JWT_SECRET ? "SET" : "MISSING",
      ADMIN_JWT_SECRET: process.env.ADMIN_JWT_SECRET ? "SET" : "MISSING",
      NODE_ENV: process.env.NODE_ENV,
    },
    tests: [],
  };

  try {
    const tables = await db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    results.tests.push({ name: "list_tables", status: "ok", count: tables.length });
  } catch (err: any) {
    results.tests.push({ name: "list_tables", status: "error", message: err.message });
  }

  try {
    const agents = await db.prepare("SELECT COUNT(*) as count FROM agents").get();
    results.tests.push({ name: "agents_count", status: "ok", count: agents?.count });
  } catch (err: any) {
    results.tests.push({ name: "agents_count", status: "error", message: err.message });
  }

  try {
    const pkgs = await db.prepare("SELECT COUNT(*) as count FROM umrah_packages").get();
    results.tests.push({ name: "packages_count", status: "ok", count: pkgs?.count });
  } catch (err: any) {
    results.tests.push({ name: "packages_count", status: "error", message: err.message });
  }

  try {
    const admin = await db.prepare("SELECT * FROM admins LIMIT 1").get();
    results.tests.push({ name: "admin_fetch", status: "ok", hasAdmin: !!admin });
  } catch (err: any) {
    results.tests.push({ name: "admin_fetch", status: "error", message: err.message });
  }

  return NextResponse.json(results);
}
