import Link from "next/link";
import { getAgent } from "@/lib/auth";
import { getAgentById, getUmrahPackages } from "@/lib/data";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
import { ArrowRight, Calculator, Wallet, Package, Plane, Calendar } from "lucide-react";

export default async function AgentDashboardPage() {
  const agentToken = await getAgent();
  if (!agentToken) redirect("/agent/login");

  const agent = await getAgentById(Number(agentToken.id)) as any;
  if (!agent) redirect("/agent/login");

  const agentPackages = await getUmrahPackages({ agent_id: agent.id }) as any[];

  const balance = agent.balance || 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0c1d4a]">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/agent/packages" className="bg-[#dc2626] text-white rounded-lg p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-lg">My Packages</h3>
              <p className="text-sm text-orange-100 mt-1">{agentPackages.length} active packages</p>
            </div>
            <Package size={24} className="text-orange-200" />
          </div>
          <div className="mt-4 flex items-center text-sm font-medium">
            Manage <ArrowRight size={16} className="ml-1" />
          </div>
        </Link>

        <Link href="/umrah-calculator" className="bg-[#EAB308] text-white rounded-lg p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-lg">Umrah Calculator</h3>
              <p className="text-sm text-yellow-100 mt-1">Build custom quotes</p>
            </div>
            <Calculator size={24} className="text-yellow-200" />
          </div>
          <div className="mt-4 flex items-center text-sm font-medium">
            Open <ArrowRight size={16} className="ml-1" />
          </div>
        </Link>

        <Link href="/agent/tickets" className="bg-[#1e3a8a] text-white rounded-lg p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-lg">Airline Tickets</h3>
              <p className="text-sm text-blue-100 mt-1">Browse & book admin tickets</p>
            </div>
            <Plane size={24} className="text-blue-200" />
          </div>
          <div className="mt-4 flex items-center text-sm font-medium">
            Book Now <ArrowRight size={16} className="ml-1" />
          </div>
        </Link>

        <Link href="/agent/bookings/package" className="bg-[#0D9488] text-white rounded-lg p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-lg">Book Packages</h3>
              <p className="text-sm text-teal-100 mt-1">Umrah packages from admin</p>
            </div>
            <Calendar size={24} className="text-teal-200" />
          </div>
          <div className="mt-4 flex items-center text-sm font-medium">
            Browse <ArrowRight size={16} className="ml-1" />
          </div>
        </Link>

        <Link href="/agent/accounts" className="bg-[#EF4444] text-white rounded-lg p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-lg">Account Closing</h3>
              <p className="text-sm text-red-100 mt-1">Closing Balance: {balance.toFixed(2)} PKR</p>
            </div>
            <Wallet size={24} className="text-red-200" />
          </div>
          <div className="mt-4 flex items-center text-sm font-medium">
            Go to list <ArrowRight size={16} className="ml-1" />
          </div>
        </Link>
      </div>


    </div>
  );
}
