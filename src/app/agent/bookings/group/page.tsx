import { getAgent } from "@/lib/auth";
import { getBookingsByAgent, getOneWayGroups } from "@/lib/data";
import { redirect } from "next/navigation";
import GroupBookingClient from "./group-list";

export default async function GroupBookingsPage() {
  const agentToken = await getAgent();
  if (!agentToken) redirect("/agent/login");

  const bookings = await getBookingsByAgent(Number(agentToken.id), "group") as any[];
  const groups = await getOneWayGroups() as any[];

  return (
    <GroupBookingClient groups={groups} bookings={bookings} />
  );
}
