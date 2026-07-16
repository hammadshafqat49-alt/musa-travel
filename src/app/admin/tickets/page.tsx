"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Plane } from "lucide-react";

interface Ticket {
  id: number;
  airline: string;
  flight_no: string;
  from_city: string;
  to_city: string;
  departure_date: string;
  departure_time: string;
  arrival_date: string | null;
  arrival_time: string | null;
  return_date: string | null;
  return_time: string | null;
  return_arrival_date: string | null;
  return_arrival_time: string | null;
  class: string;
  ticket_type: string;
  price: number;
  adult_price: number;
  child_price: number;
  infant_price: number;
  seats: number;
  available_seats: number;
  status: string;
  notes: string;
}

const emptyForm = {
  airline: "",
  flight_no: "",
  from_city: "",
  to_city: "",
  departure_date: "",
  departure_time: "",
  arrival_date: "",
  arrival_time: "",
  return_date: "",
  return_time: "",
  return_arrival_date: "",
  return_arrival_time: "",
  class: "economy",
  ticket_type: "oneway",
  price: "",
  adult_price: "",
  child_price: "",
  infant_price: "",
  seats: "",
  available_seats: "",
  status: "active",
  notes: "",
};

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Ticket | null>(null);
  const [form, setForm] = useState({ ...emptyForm });

  const fetchTickets = async () => {
    const res = await fetch("/api/admin/tickets");
    const data = await res.json();
    setTickets(data.tickets || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const resetForm = () => {
    setForm({ ...emptyForm });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.adult_price || 0),
      adult_price: Number(form.adult_price || 0),
      child_price: Number(form.child_price || 0),
      infant_price: Number(form.infant_price || 0),
      seats: Number(form.seats || 0),
      available_seats: Number(form.available_seats || form.seats || 0),
    };
    if (editing) {
      await fetch("/api/admin/tickets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, id: editing.id }),
      });
    } else {
      await fetch("/api/admin/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    resetForm();
    fetchTickets();
  };

  const handleEdit = (t: Ticket) => {
    setForm({
      airline: t.airline,
      flight_no: t.flight_no,
      from_city: t.from_city,
      to_city: t.to_city,
      departure_date: t.departure_date,
      departure_time: t.departure_time || "",
      arrival_date: t.arrival_date || "",
      arrival_time: t.arrival_time || "",
      return_date: t.return_date || "",
      return_time: t.return_time || "",
      return_arrival_date: t.return_arrival_date || "",
      return_arrival_time: t.return_arrival_time || "",
      class: t.class || "economy",
      ticket_type: t.ticket_type || "oneway",
      price: String(t.price),
      adult_price: String(t.adult_price || ""),
      child_price: String(t.child_price || ""),
      infant_price: String(t.infant_price || ""),
      seats: String(t.seats || ""),
      available_seats: String(t.available_seats ?? ""),
      status: t.status || "active",
      notes: t.notes || "",
    });
    setEditing(t);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this ticket?")) return;
    await fetch(`/api/admin/tickets?id=${id}`, { method: "DELETE" });
    fetchTickets();
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#0c1d4a]">Airline Tickets</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          <Plus size={16} /> Add Ticket
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#0c1d4a]">
              {editing ? "Edit Ticket" : "Add Ticket"}
            </h2>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Ticket Type</label>
              <select value={form.ticket_type} onChange={(e) => setForm({ ...form, ticket_type: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm">
                <option value="oneway">One Way</option>
                <option value="round">Round Trip</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Airline *</label>
              <input required placeholder="e.g. Saudi Airlines" value={form.airline} onChange={(e) => setForm({ ...form, airline: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Flight No. *</label>
              <input required placeholder="e.g. SV-701" value={form.flight_no} onChange={(e) => setForm({ ...form, flight_no: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0c1d4a] mb-1">From City *</label>
              <input required placeholder="e.g. Karachi" value={form.from_city} onChange={(e) => setForm({ ...form, from_city: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0c1d4a] mb-1">To City *</label>
              <input required placeholder="e.g. Jeddah" value={form.to_city} onChange={(e) => setForm({ ...form, to_city: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Class</label>
              <select value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm">
                <option value="economy">Economy</option>
                <option value="business">Business</option>
                <option value="first">First</option>
              </select>
            </div>

            <div className="md:col-span-3 border-t pt-4">
              <h3 className="text-sm font-bold text-[#0c1d4a] mb-3">Flight Schedule</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Departure Date *</label>
                  <input required type="date" value={form.departure_date} onChange={(e) => setForm({ ...form, departure_date: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Departure Time</label>
                  <input type="time" value={form.departure_time} onChange={(e) => setForm({ ...form, departure_time: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Arrival Date</label>
                  <input type="date" value={form.arrival_date} onChange={(e) => setForm({ ...form, arrival_date: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Arrival Time</label>
                  <input type="time" value={form.arrival_time} onChange={(e) => setForm({ ...form, arrival_time: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
                </div>
              </div>
            </div>

            {form.ticket_type === "round" && (
              <div className="md:col-span-3 border-t pt-4">
                <h3 className="text-sm font-bold text-[#0c1d4a] mb-3">Return Flight Schedule</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Return Date</label>
                    <input type="date" value={form.return_date} onChange={(e) => setForm({ ...form, return_date: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Return Time</label>
                    <input type="time" value={form.return_time} onChange={(e) => setForm({ ...form, return_time: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Return Arrival Date</label>
                    <input type="date" value={form.return_arrival_date} onChange={(e) => setForm({ ...form, return_arrival_date: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Return Arrival Time</label>
                    <input type="time" value={form.return_arrival_time} onChange={(e) => setForm({ ...form, return_arrival_time: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
                  </div>
                </div>
              </div>
            )}

            <div className="md:col-span-3 border-t pt-4">
              <h3 className="text-sm font-bold text-[#0c1d4a] mb-3">Passenger Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Adult Price (PKR)</label>
                  <input type="number" placeholder="e.g. 85000" value={form.adult_price} onChange={(e) => setForm({ ...form, adult_price: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Child Price (PKR)</label>
                  <input type="number" placeholder="e.g. 65000" value={form.child_price} onChange={(e) => setForm({ ...form, child_price: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Infant Price (PKR)</label>
                  <input type="number" placeholder="e.g. 15000" value={form.infant_price} onChange={(e) => setForm({ ...form, infant_price: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Total Seats</label>
              <input type="number" placeholder="e.g. 100" value={form.seats} onChange={(e) => setForm({ ...form, seats: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Available Seats</label>
              <input type="number" placeholder="e.g. 80" value={form.available_seats} onChange={(e) => setForm({ ...form, available_seats: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="md:col-span-3 flex justify-end gap-2">
              <button type="button" onClick={resetForm} className="px-4 py-2 border rounded-md text-sm hover:bg-gray-50">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-[#dc2626] text-white rounded-md text-sm hover:bg-[#b91c1c]">
                {editing ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-bold text-gray-700">ID</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Airline</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Flight</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Route</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Departure</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Arrival</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Type</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Class</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Pricing</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Seats (Avail.)</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Status</th>
                <th className="text-right px-4 py-3 font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{t.id}</td>
                  <td className="px-4 py-3 font-medium flex items-center gap-1.5">
                    <Plane size={14} className="text-[#dc2626]" /> {t.airline}
                  </td>
                  <td className="px-4 py-3">{t.flight_no}</td>
                  <td className="px-4 py-3">{t.from_city} &rarr; {t.to_city}</td>
                  <td className="px-4 py-3">{t.departure_date}{t.departure_time ? ` ${t.departure_time}` : ""}</td>
                  <td className="px-4 py-3">{t.arrival_date ? `${t.arrival_date}${t.arrival_time ? ` ${t.arrival_time}` : ""}` : "-"}</td>
                  <td className="px-4 py-3 capitalize">{t.ticket_type}</td>
                  <td className="px-4 py-3 capitalize">{t.class}</td>
                  <td className="px-4 py-3">
                    <div className="text-xs space-y-0.5">
                      <div className="text-gray-700">A: {t.adult_price ? `PKR ${Number(t.adult_price).toLocaleString()}` : "-"} · C: {t.child_price ? `PKR ${Number(t.child_price).toLocaleString()}` : "-"} · I: {t.infant_price ? `PKR ${Number(t.infant_price).toLocaleString()}` : "-"}</div>
                      <div className="text-gray-500">Base: PKR {Number(t.price).toLocaleString()}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{t.seats} ({t.available_seats})</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${t.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(t)} className="text-blue-500 hover:text-blue-700"><Pencil size={16} /></button>
                      <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {tickets.length === 0 && (
                <tr><td colSpan={12} className="px-4 py-8 text-center text-gray-500">No tickets found. Click "Add Ticket" to create one.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}