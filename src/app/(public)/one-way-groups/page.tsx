import { getOneWayGroups } from "@/lib/data";
import Link from "next/link";

<<<<<<< HEAD
export default async function OneWayGroupsPage() {
  const groups = await getOneWayGroups() as any[];
=======
export default function OneWayGroupsPage() {
  const groups = getOneWayGroups() as any[];
>>>>>>> 3cb85c9347b0bcd7c81e1b3ecd59cf1a0c6c8c5e

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-[#0c1d4a] mb-4">One Way Groups</h1>
        <p className="text-gray-600">Affordable one-way group travel options for agents and pilgrims.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow-sm border">
          <thead>
            <tr className="bg-[#1e3a8a] text-white">
              <th className="text-left px-4 py-3">Group Name</th>
              <th className="text-left px-4 py-3">Destination</th>
              <th className="text-left px-4 py-3">Departure</th>
              <th className="text-left px-4 py-3">Airline</th>
              <th className="text-left px-4 py-3">Price</th>
              <th className="text-left px-4 py-3">Seats</th>
              <th className="text-left px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <tr key={g.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{g.title}</td>
                <td className="px-4 py-3">{g.destination}</td>
                <td className="px-4 py-3">{g.departure_date}</td>
                <td className="px-4 py-3">{g.airline}</td>
                <td className="px-4 py-3 font-bold text-[#dc2626]">PKR {g.price.toLocaleString()}</td>
                <td className="px-4 py-3">{g.available_seats}/{g.seats}</td>
                <td className="px-4 py-3">
                  <Link href="/agent/login" className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-3 py-1.5 rounded text-sm transition-colors">Book</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
