"use client";
import { withPermission } from "@/lib/with-permission";

import { useEffect, useState } from "react";
import { Trash2, RefreshCw, User, Phone, Mail, Eye, X } from "lucide-react";

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

function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

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
                <th className="text-left px-4 py-3 font-bold text-gray-700">ID</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Client / Agent</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Type</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Ref#</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Adults</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Total</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Status</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Date</th>
                <th className="text-right px-4 py-3 font-bold text-gray-700">Actions</th>
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
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold text-[#0c1d4a]">
                Booking #{selectedBooking.id} Details
              </h2>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex items-center gap-3">
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  selectedBooking.status === "confirmed"
                    ? "bg-green-100 text-green-700"
                    : selectedBooking.status === "cancelled"
                    ? "bg-red-100 text-red-700"
                    : selectedBooking.status === "completed"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {selectedBooking.status}
                </span>
                <span className="text-sm text-gray-500">
                  {selectedBooking.created_at
                    ? new Date(selectedBooking.created_at).toLocaleString()
                    : "-"}
                </span>
              </div>

              {/* Client / Agent Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Client Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Name</span>
                      <span className="font-medium">{selectedBooking.client_name || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phone</span>
                      <span className="font-medium">{selectedBooking.client_phone || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email</span>
                      <span className="font-medium">{selectedBooking.client_email || "-"}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Agent Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Agent</span>
                      <span className="font-medium">
                        {selectedBooking.agent_name || "Direct Client"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Agent ID</span>
                      <span className="font-medium">{selectedBooking.agent_id || "-"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Booking Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Type</span>
                    <span className="font-medium capitalize">{selectedBooking.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Reference #</span>
                    <span className="font-medium">{selectedBooking.reference_id || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Package ID</span>
                    <span className="font-medium">{selectedBooking.package_id || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Group ID</span>
                    <span className="font-medium">{selectedBooking.group_id || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Adults</span>
                    <span className="font-medium">{selectedBooking.adults}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Infants</span>
                    <span className="font-medium">{selectedBooking.infants || "0"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Room Type</span>
                    <span className="font-medium capitalize">{selectedBooking.room_type || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Amount</span>
                    <span className="font-bold text-[#dc2626]">
                      PKR {Number(selectedBooking.total_amount).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedBooking.notes && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Notes</h3>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedBooking.notes}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t flex justify-end gap-2">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 border rounded-md text-sm hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default withPermission(AdminBookingsPage, 'bookings');
