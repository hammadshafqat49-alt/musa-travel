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
  return_date: string | null;
  return_time: string | null;
  class: string;
  ticket_type: string;
  price: number;
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
  return_date: "",
  return_time: "",
  class: "economy",
  ticket_type: "oneway",
  price: "",
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
      price: Number(form.price),
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
      return_date: t.return_date || "",
      return_time: t.return_time || "",
      class: t.class || "economy",
      ticket_type: t.ticket_type || "oneway",
      price: String(t.price),
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
            <input required placeholder="Airline" value={form.airline} onChange={(e) => setForm({ ...form, airline: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input required placeholder="Flight No." value={form.flight_no} onChange={(e) => setForm({ ...form, flight_no: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input required placeholder="From City" value={form.from_city} onChange={(e) => setForm({ ...form, from_city: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input required placeholder="To City" value={form.to_city} onChange={(e) => setForm({ ...form, to_city: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input required type="date" value={form.departure_date} onChange={(e) => setForm({ ...form, departure_date: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input type="time" placeholder="Departure Time" value={form.departure_time} onChange={(e) => setForm({ ...form, departure_time: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input type="date" placeholder="Return Date (round-trip)" value={form.return_date} onChange={(e) => setForm({ ...form, return_date: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input type="time" placeholder="Return Time" value={form.return_time} onChange={(e) => setForm({ ...form, return_time: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <select value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })} className="px-3 py-2 border rounded-md text-sm">
              <option value="economy">Economy</option>
              <option value="business">Business</option>
              <option value="first">First</option>
            </select>
            <select value={form.ticket_type} onChange={(e) => setForm({ ...form, ticket_type: e.target.value })} className="px-3 py-2 border rounded-md text-sm">
              <option value="oneway">One Way</option>
              <option value="round">Round Trip</option>
            </select>
            <input required type="number" placeholder="Price (PKR)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input type="number" placeholder="Total Seats" value={form.seats} onChange={(e) => setForm({ ...form, seats: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input type="number" placeholder="Available Seats" value={form.available_seats} onChange={(e) => setForm({ ...form, available_seats: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="px-3 py-2 border rounded-md text-sm">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <input placeholder="Notes (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="px-3 py-2 border rounded-md text-sm md:col-span-2" />
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
                <th className="text-left px-4 py-3 font-medium text-gray-600">ID</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Airline</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Flight</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Route</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Departure</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Type</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Class</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Price</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Seats (Avail.)</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
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
                  <td className="px-4 py-3 capitalize">{t.ticket_type}</td>
                  <td className="px-4 py-3 capitalize">{t.class}</td>
                  <td className="px-4 py-3">PKR {Number(t.price).toLocaleString()}</td>
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
                <tr><td colSpan={11} className="px-4 py-8 text-center text-gray-500">No tickets found. Click "Add Ticket" to create one.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}