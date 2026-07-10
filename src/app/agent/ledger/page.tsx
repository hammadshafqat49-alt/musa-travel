import { getAgent } from "@/lib/auth";
import { getLedger, getAgentById } from "@/lib/data";
import { redirect } from "next/navigation";
import LedgerClient from "./ledger-client";

export default async function LedgerPage() {
  const agentToken = await getAgent();
  if (!agentToken) redirect("/agent/login");

<<<<<<< HEAD
  const entries = await getLedger(Number(agentToken.id)) as any[];
  const agent = await getAgentById(Number(agentToken.id)) as any;
=======
  const entries = getLedger(Number(agentToken.id)) as any[];
  const agent = getAgentById(Number(agentToken.id)) as any;
>>>>>>> 3cb85c9347b0bcd7c81e1b3ecd59cf1a0c6c8c5e

  return (
    <LedgerClient entries={entries} agent={agent || {}} />
  );
}
