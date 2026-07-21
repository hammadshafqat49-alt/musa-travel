"use client";
import { withPermission } from "@/lib/with-permission";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface Hotel {
  id: number;
  name: string;
  city: string;
}

interface Rate {
  id: number;
  hotel_id: number;
  hotel_name: string;
  city: string;
  date_from: string;
  date_to: string;
  sharing_price: number;
  double_price: number;
  triple_price: number;
  quad_price: number;
}

function AdminHotelRatesPage() {
  const [rates, setRates] = useState<Rate[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Rate | null>(null);
  const [form, setForm] = useState({
    hotel_id: "", date_from: "", date_to: "", sharing_price: "", double_price: "", triple_price: "", quad_price: "",
  });

  const fetchRates = async () => {
    const res = await fetch("/api/admin/hotel-rates");
    const data = await res.json();
    setRates(data.rates || []);
    setLoading(false);
  };

  const fetchHotels = async () => {
    const res = await fetch("/api/admin/hotels");
    const data = await res.json();
    setHotels(data.hotels || []);
  };

  useEffect(() => {
    fetchRates();
    fetchHotels();
  }, []);

  const resetForm = () => {
    setForm({ hotel_id: "", date_from: "", date_to: "", sharing_price: "", double_price: "", triple_price: "", quad_price: "" });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      hotel_id: Number(form.hotel_id),
      sharing_price: Number(form.sharing_price),
      double_price: Number(form.double_price),
      triple_price: Number(form.triple_price),
      quad_price: Number(form.quad_price),
    };
    if (editing) {
      await fetch("/api/admin/hotel-rates", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, id: editing.id }) });
    } else {
      await fetch("/api/admin/hotel-rates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    }
    resetForm();
    fetchRates();
  };

  const handleEdit = (r: Rate) => {
    setForm({
      hotel_id: String(r.hotel_id), date_from: r.date_from || "", date_to: r.date_to || "",
      sharing_price: String(r.sharing_price || 0), double_price: String(r.double_price || 0),
      triple_price: String(r.triple_price || 0), quad_price: String(r.quad_price || 0),
    });
    setEditing(r);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this rate?")) return;
    await fetch(`/api/admin/hotel-rates?id=${id}`, { method: "DELETE" });
    fetchRates();
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#0c1d4a]">Hotel Rates</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2 rounded-md text-sm font-medium"><Plus size={16} /> Add Rate</button>
      </div>
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">{editing ? "Edit Rate" : "Add Rate"}</h2>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select required value={form.hotel_id} onChange={(e) => setForm({ ...form, hotel_id: e.target.value })} className="px-3 py-2 border rounded-md text-sm">
              <option value="">Select Hotel</option>
              {hotels.map((h) => (
                <option key={h.id} value={h.id}>{h.name} ({h.city})</option>
              ))}
            </select>
            <input required type="date" value={form.date_from} onChange={(e) => setForm({ ...form, date_from: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input required type="date" value={form.date_to} onChange={(e) => setForm({ ...form, date_to: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input type="number" placeholder="Sharing Price" value={form.sharing_price} onChange={(e) => setForm({ ...form, sharing_price: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input type="number" placeholder="Double Price" value={form.double_price} onChange={(e) => setForm({ ...form, double_price: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input type="number" placeholder="Triple Price" value={form.triple_price} onChange={(e) => setForm({ ...form, triple_price: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input type="number" placeholder="Quad Price" value={form.quad_price} onChange={(e) => setForm({ ...form, quad_price: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
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
                <th className="text-left px-4 py-3 font-medium text-gray-600">Hotel</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">From</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">To</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Sharing</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Double</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Triple</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Quad</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rates.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{r.id}</td>
                  <td className="px-4 py-3 font-medium">{r.hotel_name} <span className="text-gray-400">({r.city})</span></td>
                  <td className="px-4 py-3">{r.date_from}</td>
                  <td className="px-4 py-3">{r.date_to}</td>
                  <td className="px-4 py-3">{r.sharing_price || "-"}</td>
                  <td className="px-4 py-3">{r.double_price || "-"}</td>
                  <td className="px-4 py-3">{r.triple_price || "-"}</td>
                  <td className="px-4 py-3">{r.quad_price || "-"}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(r)} className="text-blue-500 hover:text-blue-700"><Pencil size={16} /></button>
                      <button onClick={() => handleDelete(r.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {rates.length === 0 && <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-500">No rates found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default withPermission(AdminHotelRatesPage, 'hotels');
