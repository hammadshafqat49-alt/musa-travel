import { getAgent } from "@/lib/auth";
import { getBankDetails } from "@/lib/data";
import { redirect } from "next/navigation";

export default async function BankDetailsPage() {
  const agentToken = await getAgent();
  if (!agentToken) redirect("/agent/login");

  const banks = getBankDetails(Number(agentToken.id)) as any[];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Bank Details</h1>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="font-bold mb-4">Add Bank Account</h2>
          <form action="/api/agent/bank-details" method="POST" className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
              <input type="text" name="bank_name" required className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Title</label>
              <input type="text" name="account_title" required className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
              <input type="text" name="account_number" required className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">IBAN</label>
              <input type="text" name="iban" className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
              <input type="text" name="branch" className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div className="flex items-end">
              <button type="submit" className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2 rounded-md text-sm font-medium">Add Account</button>
            </div>
          </form>
        </div>

        <div className="p-6">
          <h2 className="font-bold mb-4">My Bank Accounts</h2>
          {banks.length === 0 ? (
            <p className="text-gray-500">No bank accounts added yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3">Bank</th>
                    <th className="text-left py-2 px-3">Account Title</th>
                    <th className="text-left py-2 px-3">Account Number</th>
                    <th className="text-left py-2 px-3">IBAN</th>
                    <th className="text-left py-2 px-3">Branch</th>
                  </tr>
                </thead>
                <tbody>
                  {banks.map((b) => (
                    <tr key={b.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-3 font-medium">{b.bank_name}</td>
                      <td className="py-2 px-3">{b.account_title}</td>
                      <td className="py-2 px-3">{b.account_number}</td>
                      <td className="py-2 px-3">{b.iban || "N/A"}</td>
                      <td className="py-2 px-3">{b.branch || "N/A"}</td>
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
