"use client";

import { useEffect, useState } from "react";
import { Trash2, RefreshCw, User, Phone, Mail } from "lucide-react";

interface Booking {
  id: number;
  agent_id: number;
  agent_name: string;
  type: string;
  reference_id: string;
  package_id: number;
  group_id: number;
  adults: number;
  infants: number;
  total_amount: number;
  status: string;
  notes: string;
  room_type: string;
  client_name: string;
  client_phone: string;
  client_email: string;
  created_at: string;
}

const statuses = ["pending", "confirmed", "cancelled", "completed"];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    const res = await fetch("/api/admin/bookings");
    const data = await res.json();
    setBookings(data.bookings || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    await fetch("/api/admin/bookings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchBookings();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this booking?")) return;
    await fetch(`/api/admin/bookings?id=${id}`, { method: "DELETE" });
    fetchBookings();
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#0c1d4a]">All Bookings</h1>
        <button
          onClick={fetchBookings}
          className="flex items-center gap-2 text-gray-500 hover:text-[#dc2626] text-sm"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">ID</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Client / Agent</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Type</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Ref#</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Adults</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Total</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {bookings.map((b) => {
                const isDirectClient = !b.agent_id || b.agent_name === "Direct Client";
                return (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{b.id}</td>
                    <td className="px-4 py-3">
                      {isDirectClient ? (
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1 text-xs font-medium text-[#0c1d4a]">
                            <User size={12} className="text-[#dc2626]" />
                            {b.client_name || "N/A"}
                          </div>
                          {b.client_phone && (
                            <div className="flex items-center gap-1 text-[11px] text-gray-500">
                              <Phone size={10} /> {b.client_phone}
                            </div>
                          )}
                          {b.client_email && (
                            <div className="flex items-center gap-1 text-[11px] text-gray-500">
                              <Mail size={10} /> {b.client_email}
                            </div>
                          )}
                          <span className="inline-block mt-1 px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[10px] rounded font-medium">
                            Direct Client
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          <div className="text-xs font-medium text-[#0c1d4a]">{b.agent_name}</div>
                          <span className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded font-medium">
                            Agent
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 capitalize">{b.type}</td>
                    <td className="px-4 py-3">{b.reference_id || "-"}</td>
                    <td className="px-4 py-3">{b.adults}</td>
                    <td className="px-4 py-3">
                      PKR {Number(b.total_amount).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={b.status}
                        onChange={(e) => updateStatus(b.id, e.target.value)}
                        className="px-2 py-1 border rounded-md text-xs"
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      {b.created_at ? new Date(b.created_at).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {bookings.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
