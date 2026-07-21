"use client";
import { withPermission } from "@/lib/with-permission";

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

function AdminHotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [rates, setRates] = useState<Rate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);

  const [form, setForm] = useState({
    name: "", city: "", rating: "", address: "", distance: "",
    sharing_price: "", double_price: "", triple_price: "", quad_price: "",
  });

  const fetchData = async () => {
    const [hotelsRes, ratesRes] = await Promise.all([
      fetch("/api/admin/hotels"),
      fetch("/api/admin/hotel-rates"),
    ]);
    const hotelsData = await hotelsRes.json();
    const ratesData = await ratesRes.json();
    setHotels(hotelsData.hotels || []);
    setRates(ratesData.rates || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setForm({ name: "", city: "", rating: "", address: "", distance: "", sharing_price: "", double_price: "", triple_price: "", quad_price: "" });
    setEditingHotel(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Save hotel
    const hotelPayload = { name: form.name, city: form.city, rating: Number(form.rating), address: form.address, distance: form.distance };
    let hotelId = editingHotel?.id;

    if (editingHotel) {
      await fetch("/api/admin/hotels", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...hotelPayload, id: editingHotel.id }) });
    } else {
      const res = await fetch("/api/admin/hotels", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(hotelPayload) });
      const data = await res.json();
      hotelId = data.id;
    }

    // 2. Save rate if any rate field is filled
    const hasRate = form.sharing_price || form.double_price || form.triple_price || form.quad_price;
    if (hasRate && hotelId) {
      const existingRate = rates.find((r) => r.hotel_id === hotelId);
      const ratePayload = {
        hotel_id: hotelId,
        sharing_price: Number(form.sharing_price || 0),
        double_price: Number(form.double_price || 0),
        triple_price: Number(form.triple_price || 0),
        quad_price: Number(form.quad_price || 0),
      };
      if (existingRate) {
        await fetch("/api/admin/hotel-rates", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...ratePayload, id: existingRate.id }) });
      } else {
        await fetch("/api/admin/hotel-rates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(ratePayload) });
      }
    }

    resetForm();
    fetchData();
  };

  const handleEdit = (h: Hotel) => {
    const rate = rates.find((r) => r.hotel_id === h.id);
    setForm({
      name: h.name,
      city: h.city,
      rating: String(h.rating || ""),
      address: h.address || "",
      distance: h.distance || "",
      sharing_price: String(rate?.sharing_price || ""),
      double_price: String(rate?.double_price || ""),
      triple_price: String(rate?.triple_price || ""),
      quad_price: String(rate?.quad_price || ""),
    });
    setEditingHotel(h);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this hotel and its rates?")) return;
    await fetch(`/api/admin/hotels?id=${id}`, { method: "DELETE" });
    const rate = rates.find((r) => r.hotel_id === id);
    if (rate) {
      await fetch(`/api/admin/hotel-rates?id=${rate.id}`, { method: "DELETE" });
    }
    fetchData();
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#0c1d4a]">Hotels</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2 rounded-md text-sm font-medium">
          <Plus size={16} /> Add Hotel
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">{editingHotel ? "Edit Hotel" : "Add Hotel"}</h2>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Hotel Name *</label>
                <input required placeholder="e.g. Hilton Makkah" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0c1d4a] mb-1">City *</label>
                <input required placeholder="e.g. Makkah" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Rating</label>
                <input type="number" step="0.1" placeholder="e.g. 4.5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Address</label>
                <input placeholder="e.g. Ibrahim Al Khalil Road" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Distance from Haram</label>
                <input placeholder="e.g. 200 meters" value={form.distance} onChange={(e) => setForm({ ...form, distance: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
              </div>
            </div>

            <div className="border-t pt-4 mb-4">
              <h3 className="text-sm font-bold text-[#0c1d4a] mb-3">Room Rates</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Sharing Price (PKR)</label>
                  <input type="number" placeholder="e.g. 5000" value={form.sharing_price} onChange={(e) => setForm({ ...form, sharing_price: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Double Price (PKR)</label>
                  <input type="number" placeholder="e.g. 8000" value={form.double_price} onChange={(e) => setForm({ ...form, double_price: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Triple Price (PKR)</label>
                  <input type="number" placeholder="e.g. 7000" value={form.triple_price} onChange={(e) => setForm({ ...form, triple_price: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Quad Price (PKR)</label>
                  <input type="number" placeholder="e.g. 6000" value={form.quad_price} onChange={(e) => setForm({ ...form, quad_price: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button type="button" onClick={resetForm} className="px-4 py-2 border rounded-md text-sm hover:bg-gray-50">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-[#dc2626] text-white rounded-md text-sm hover:bg-[#b91c1c]">{editingHotel ? "Update" : "Create"}</button>
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
                <th className="text-left px-4 py-3 font-bold text-gray-700">Name</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">City</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Rating</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Address</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Distance</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Rates</th>
                <th className="text-right px-4 py-3 font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {hotels.map((h) => {
                const rate = rates.find((r) => r.hotel_id === h.id);
                return (
                  <tr key={h.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{h.id}</td>
                    <td className="px-4 py-3 font-medium">{h.name}</td>
                    <td className="px-4 py-3">{h.city}</td>
                    <td className="px-4 py-3">{h.rating || "-"}</td>
                    <td className="px-4 py-3">{h.address || "-"}</td>
                    <td className="px-4 py-3">{h.distance || "-"}</td>
                    <td className="px-4 py-3">
                      {rate ? (
                        <div className="text-xs text-gray-700">
                          S: {rate.sharing_price || "-"} · D: {rate.double_price || "-"} · T: {rate.triple_price || "-"} · Q: {rate.quad_price || "-"}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">No rates</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(h)} className="text-blue-500 hover:text-blue-700"><Pencil size={16} /></button>
                        <button onClick={() => handleDelete(h.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {hotels.length === 0 && <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500">No hotels found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default withPermission(AdminHotelsPage, 'hotels');
