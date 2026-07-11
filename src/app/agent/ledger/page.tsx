import { getAgent } from "@/lib/auth";
import { getLedger, getAgentById } from "@/lib/data";
import { redirect } from "next/navigation";
import LedgerClient from "./ledger-client";

export default async function LedgerPage() {
  const agentToken = await getAgent();
  if (!agentToken) redirect("/agent/login");

  const entries = await getLedger(Number(agentToken.id)) as any[];
  const agent = await getAgentById(Number(agentToken.id)) as any;

  return (
    <LedgerClient entries={entries} agent={agent || {}} />
  );
}
