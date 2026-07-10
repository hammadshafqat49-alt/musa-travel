import { getAgent } from "@/lib/auth";
import { getBookingsByAgent, getUmrahGroups } from "@/lib/data";
import { redirect } from "next/navigation";
import UmrahGroupBookingClient from "./umrah-group-list";

export default async function UmrahBookingsPage() {
  const agentToken = await getAgent();
  if (!agentToken) redirect("/agent/login");

  const bookings = await getBookingsByAgent(Number(agentToken.id), "umrah") as any[];
  const groups = await getUmrahGroups() as any[];

  return (
    <UmrahGroupBookingClient groups={groups} bookings={bookings} />
  );
}
