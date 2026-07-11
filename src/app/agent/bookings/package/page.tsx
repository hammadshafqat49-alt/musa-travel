import { getAgent } from "@/lib/auth";
import { getBookingsByAgent, getUmrahPackages } from "@/lib/data";
import { redirect } from "next/navigation";
import PackageBookingClient from "./package-list";

export default async function PackageBookingPage() {
  const agentToken = await getAgent();
  if (!agentToken) redirect("/agent/login");

  const bookings = await getBookingsByAgent(Number(agentToken.id), "package") as any[];
  const packages = await getUmrahPackages() as any[];

  return (
    <PackageBookingClient packages={packages} bookings={bookings} />
  );
}
