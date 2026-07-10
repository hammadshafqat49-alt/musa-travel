import { getAgent } from "@/lib/auth";
import { getBookingsByAgent, getOneWayGroups } from "@/lib/data";
import { redirect } from "next/navigation";
import GroupBookingClient from "./group-list";

export default async function GroupBookingsPage() {
  const agentToken = await getAgent();
  if (!agentToken) redirect("/agent/login");

<<<<<<< HEAD
  const bookings = await getBookingsByAgent(Number(agentToken.id), "group") as any[];
  const groups = await getOneWayGroups() as any[];
=======
  const bookings = getBookingsByAgent(Number(agentToken.id), "group") as any[];
  const groups = getOneWayGroups() as any[];
>>>>>>> 3cb85c9347b0bcd7c81e1b3ecd59cf1a0c6c8c5e

  return (
    <GroupBookingClient groups={groups} bookings={bookings} />
  );
}
