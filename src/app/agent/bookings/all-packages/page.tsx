import { getAgent } from "@/lib/auth";
import { getBookingsByAgent, getUmrahPackages, getUmrahGroups, getOneWayGroups } from "@/lib/data";
import { redirect } from "next/navigation";

export default async function AllPackageBookingsPage() {
  const agentToken = await getAgent();
  if (!agentToken) redirect("/agent/login");

  const bookings = await getBookingsByAgent(Number(agentToken.id)) as any[];
  const packages = await getUmrahPackages() as any[];
  const umrahGroups = await getUmrahGroups() as any[];
  const oneWayGroups = await getOneWayGroups() as any[];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">All Bookings</h1>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        {bookings.length === 0 ? (
          <p className="text-gray-500">No bookings found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Ref#</th>
                  <th className="text-left py-2 px-3">Type</th>
                  <th className="text-left py-2 px-3">Item</th>
                  <th className="text-left py-2 px-3">Adults</th>
                  <th className="text-left py-2 px-3">Infants</th>
                  <th className="text-left py-2 px-3">Amount</th>
                  <th className="text-left py-2 px-3">Status</th>
                  <th className="text-left py-2 px-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => {
                  let itemName = "N/A";
                  if (b.type === "package") {
                    itemName = packages.find((p) => p.id === b.package_id)?.title || "N/A";
                  } else if (b.type === "umrah") {
                    itemName = umrahGroups.find((g) => g.id === b.group_id)?.title || "N/A";
                  } else if (b.type === "group") {
                    itemName = oneWayGroups.find((g) => g.id === b.group_id)?.title || "N/A";
                  } else if (b.type === "ticket") {
                    itemName = "Ticket #" + b.ticket_id;
                  }
                  return (
                    <tr key={b.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-3">{b.reference_id}</td>
                      <td className="py-2 px-3 capitalize">{b.type}</td>
                      <td className="py-2 px-3">{itemName}</td>
                      <td className="py-2 px-3">{b.adults}</td>
                      <td className="py-2 px-3">{b.infants}</td>
                      <td className="py-2 px-3">PKR {b.total_amount?.toLocaleString()}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-1 rounded text-xs ${b.status === "confirmed" ? "bg-green-100 text-green-700" : b.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="py-2 px-3">{b.created_at?.split("T")[0]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
