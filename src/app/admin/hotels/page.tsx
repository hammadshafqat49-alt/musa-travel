"use client";
import { withPermission } from "@/lib/with-permission";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Upload } from "lucide-react";

interface Hotel {
  id: number;
  name: string;
  city: string;
  rating: number;
  address: string;
  distance: string;
  image_url: string;
  created_at: string;
}

function AdminHotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);

  const [form, setForm] = useState({
    name: "", city: "", rating: "", address: "", distance: "", image_url: "",
  });

  const fetchData = async () => {
    const hotelsRes = await fetch("/api/admin/hotels");
    const hotelsData = await hotelsRes.json();
    setHotels(hotelsData.hotels || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setForm({ name: "", city: "", rating: "", address: "", distance: "", image_url: "" });
    setEditingHotel(null);
    setShowForm(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image_url: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hotelPayload = {
      name: form.name,
      city: form.city,
      rating: form.rating ? Number(form.rating) : null,
      address: form.address,
      distance: form.distance,
      image_url: form.image_url,
    };

    const res = await fetch("/api/admin/hotels", {
      method: editingHotel ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingHotel ? { ...hotelPayload, id: editingHotel.id } : hotelPayload),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to save hotel");
      return;
    }

    resetForm();
    fetchData();
  };

  const handleEdit = (h: Hotel) => {
    setForm({
      name: h.name,
      city: h.city,
      rating: String(h.rating || ""),
      address: h.address || "",
      distance: h.distance || "",
      image_url: h.image_url || "",
    });
    setEditingHotel(h);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this hotel?")) return;
    await fetch(`/api/admin/hotels?id=${id}`, { method: "DELETE" });
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
              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Hotel Image</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 border rounded-md cursor-pointer hover:bg-gray-200 transition-colors text-sm font-medium">
                    <Upload size={16} />
                    <span>Choose File</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  {form.image_url && (
                    <img src={form.image_url} alt="Preview" className="w-16 h-12 object-cover rounded border" />
                  )}
                  <span className="text-xs text-gray-500">{form.image_url ? "Image selected" : "No file chosen"}</span>
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
                <th className="text-left px-4 py-3 font-bold text-gray-700">Image</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Name</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">City</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Rating</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Address</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Distance</th>
                <th className="text-right px-4 py-3 font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {hotels.map((h) => (
                  <tr key={h.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{h.id}</td>
                    <td className="px-4 py-3">
                      {h.image_url ? (
                        <img src={h.image_url} alt={h.name} className="w-14 h-10 object-cover rounded" />
                      ) : (
                        <div className="w-14 h-10 bg-gray-200 rounded flex items-center justify-center text-[10px] text-gray-400">No img</div>
                      )}
                    </td>
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
              {hotels.length === 0 && <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500">No hotels found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default withPermission(AdminHotelsPage, 'hotels');
