import { getAgent } from "@/lib/auth";
import { getPayments } from "@/lib/data";
import { redirect } from "next/navigation";

export default async function PaymentsPage() {
  const agentToken = await getAgent();
  if (!agentToken) redirect("/agent/login");

  const payments = getPayments(Number(agentToken.id)) as any[];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Add Payments</h1>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="font-bold mb-4">New Payment</h2>
          <form action="/api/agent/payments" method="POST" className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (PKR)</label>
              <input type="number" name="amount" required min={1} className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
              <select name="method" className="w-full px-3 py-2 border rounded-md">
                <option>Bank Transfer</option>
                <option>Cash Deposit</option>
                <option>Cheque</option>
                <option>Online Payment</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reference</label>
              <input type="text" name="reference" className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <input type="text" name="notes" className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div className="flex items-end">
              <button type="submit" className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2 rounded-md text-sm font-medium">Submit Payment</button>
            </div>
          </form>
        </div>

        <div className="p-6">
          <h2 className="font-bold mb-4">Payment History</h2>
          {payments.length === 0 ? (
            <p className="text-gray-500">No payments found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3">Date</th>
                    <th className="text-left py-2 px-3">Amount</th>
                    <th className="text-left py-2 px-3">Method</th>
                    <th className="text-left py-2 px-3">Reference</th>
                    <th className="text-left py-2 px-3">Status</th>
                    <th className="text-left py-2 px-3">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-3">{p.date?.split("T")[0]}</td>
                      <td className="py-2 px-3 font-medium">PKR {p.amount.toLocaleString()}</td>
                      <td className="py-2 px-3">{p.method}</td>
                      <td className="py-2 px-3">{p.reference || "N/A"}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-1 rounded text-xs ${p.status === "approved" ? "bg-green-100 text-green-700" : p.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-2 px-3">{p.notes || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
