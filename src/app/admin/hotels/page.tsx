"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface Hotel {
  id: number;
  name: string;
  city: string;
  rating: number;
  address: string;
  distance: string;
  created_at: string;
}

export default function AdminHotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Hotel | null>(null);
  const [form, setForm] = useState({ name: "", city: "", rating: "", address: "", distance: "" });

  const fetchHotels = async () => {
    const res = await fetch("/api/admin/hotels");
    const data = await res.json();
    setHotels(data.hotels || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const resetForm = () => {
    setForm({ name: "", city: "", rating: "", address: "", distance: "" });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, rating: Number(form.rating) };
    if (editing) {
      await fetch("/api/admin/hotels", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, id: editing.id }) });
    } else {
      await fetch("/api/admin/hotels", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    }
    resetForm();
    fetchHotels();
  };

  const handleEdit = (h: Hotel) => {
    setForm({ name: h.name, city: h.city, rating: String(h.rating || ""), address: h.address || "", distance: h.distance || "" });
    setEditing(h);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this hotel?")) return;
    await fetch(`/api/admin/hotels?id=${id}`, { method: "DELETE" });
    fetchHotels();
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#0c1d4a]">Hotels</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2 rounded-md text-sm font-medium"><Plus size={16} /> Add Hotel</button>
      </div>
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">{editing ? "Edit Hotel" : "Add Hotel"}</h2>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input required placeholder="Hotel Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input required placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input type="number" step="0.1" placeholder="Rating" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input placeholder="Distance from Haram" value={form.distance} onChange={(e) => setForm({ ...form, distance: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <div className="md:col-span-3 flex justify-end gap-2">
              <button type="button" onClick={resetForm} className="px-4 py-2 border rounded-md text-sm hover:bg-gray-50">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-[#dc2626] text-white rounded-md text-sm hover:bg-[#b91c1c]">{editing ? "Update" : "Create"}</button>
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
                <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">City</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Rating</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Address</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Distance</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {hotels.map((h) => (
                <tr key={h.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{h.id}</td>
                  <td className="px-4 py-3 font-medium">{h.name}</td>
                  <td className="px-4 py-3">{h.city}</td>
                  <td className="px-4 py-3">{h.rating || "-"}</td>
                  <td className="px-4 py-3">{h.address || "-"}</td>
                  <td className="px-4 py-3">{h.distance || "-"}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(h)} className="text-blue-500 hover:text-blue-700"><Pencil size={16} /></button>
                      <button onClick={() => handleDelete(h.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {hotels.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">No hotels found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
