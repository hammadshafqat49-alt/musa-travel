import { getAgent } from "@/lib/auth";
import { getBookingsByAgent, getUmrahGroups } from "@/lib/data";
import { redirect } from "next/navigation";
import UmrahGroupBookingClient from "./umrah-group-list";

export default async function UmrahBookingsPage() {
  const agentToken = await getAgent();
  if (!agentToken) redirect("/agent/login");

<<<<<<< HEAD
  const bookings = await getBookingsByAgent(Number(agentToken.id), "umrah") as any[];
  const groups = await getUmrahGroups() as any[];
=======
  const bookings = getBookingsByAgent(Number(agentToken.id), "umrah") as any[];
  const groups = getUmrahGroups() as any[];
>>>>>>> 3cb85c9347b0bcd7c81e1b3ecd59cf1a0c6c8c5e

  return (
    <UmrahGroupBookingClient groups={groups} bookings={bookings} />
  );
}
