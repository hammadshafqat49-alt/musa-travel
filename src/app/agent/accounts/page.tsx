import { getAgent } from "@/lib/auth";
import { getAgentById, getBookingsByAgent, getPayments, getLedger } from "@/lib/data";
import { redirect } from "next/navigation";

export default async function AccountsPage() {
  const agentToken = await getAgent();
  if (!agentToken) redirect("/agent/login");

  const agent = await getAgentById(Number(agentToken.id)) as any;
  const bookings = await getBookingsByAgent(Number(agentToken.id)) as any[];
  const payments = await getPayments(Number(agentToken.id)) as any[];
  const ledger = await getLedger(Number(agentToken.id)) as any[];

  const totalBookings = bookings.reduce((sum, b) => sum + (b.total_amount || 0), 0);
  const totalPaid = payments.filter((p) => p.status === "approved").reduce((sum, p) => sum + p.amount, 0);
  const balance = agent?.balance || 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Accounts</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-sm text-gray-500">Total Bookings Value</p>
          <p className="text-2xl font-bold text-[#0c1d4a]">PKR {totalBookings.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-sm text-gray-500">Total Paid</p>
          <p className="text-2xl font-bold text-green-600">PKR {totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-sm text-gray-500">Closing Balance</p>
          <p className="text-2xl font-bold text-[#dc2626]">PKR {balance.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="font-bold mb-4">Account Summary</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3">Date</th>
                <th className="text-left py-2 px-3">Description</th>
                <th className="text-left py-2 px-3">Debit</th>
                <th className="text-left py-2 px-3">Credit</th>
                <th className="text-left py-2 px-3">Balance</th>
              </tr>
            </thead>
            <tbody>
              {ledger.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-500">No ledger entries yet.</td></tr>
              ) : (
                ledger.map((l) => (
                  <tr key={l.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-3">{l.date?.split("T")[0]}</td>
                    <td className="py-2 px-3">{l.description}</td>
                    <td className="py-2 px-3 text-red-600">{l.type === "debit" ? `PKR ${l.amount.toLocaleString()}` : "-"}</td>
                    <td className="py-2 px-3 text-green-600">{l.type === "credit" ? `PKR ${l.amount.toLocaleString()}` : "-"}</td>
                    <td className="py-2 px-3 font-medium">PKR {l.balance.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
