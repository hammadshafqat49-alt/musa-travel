import { getAgent } from "@/lib/auth";
import { getBookingsByAgent, getUmrahPackages } from "@/lib/data";
import { redirect } from "next/navigation";
import PackageBookingClient from "./package-list";

export default async function PackageBookingPage() {
  const agentToken = await getAgent();
  if (!agentToken) redirect("/agent/login");

<<<<<<< HEAD
  const bookings = await getBookingsByAgent(Number(agentToken.id), "package") as any[];
  const packages = await getUmrahPackages() as any[];
=======
  const bookings = getBookingsByAgent(Number(agentToken.id), "package") as any[];
  const packages = getUmrahPackages() as any[];
>>>>>>> 3cb85c9347b0bcd7c81e1b3ecd59cf1a0c6c8c5e

  return (
    <PackageBookingClient packages={packages} bookings={bookings} />
  );
}
