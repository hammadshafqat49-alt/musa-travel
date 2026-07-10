"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Package } from "lucide-react";
import Link from "next/link";

interface UmrahPackage {
  id: number;
  title: string;
  airline: string;
  departure_date: string;
  return_date: string;
  days: number;
  price: number;
  visa_price: number;
  hotel_makkah: string;
  hotel_madina: string;
  status: string;
  image_url: string;
  sharing_price: number;
  double_price: number;
  triple_price: number;
  quad_price: number;
  quint_price: number;
}

export default function AgentPackagesPage() {
  const [packages, setPackages] = useState<UmrahPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<UmrahPackage | null>(null);
  const [form, setForm] = useState({
    title: "",
    airline: "",
    departure_date: "",
    return_date: "",
    days: "",
    price: "",
    visa_price: "0",
    hotel_makkah: "",
    hotel_madina: "",
    image_url: "",
    sharing_price: "",
    double_price: "",
    triple_price: "",
    quad_price: "",
    quint_price: "",
  });

  const fetchPackages = async () => {
    const res = await fetch("/api/agent/packages");
    const data = await res.json();
    setPackages(data.packages || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const resetForm = () => {
    setForm({
      title: "",
      airline: "",
      departure_date: "",
      return_date: "",
      days: "",
      price: "",
      visa_price: "0",
      hotel_makkah: "",
      hotel_madina: "",
      image_url: "",
      sharing_price: "",
      double_price: "",
      triple_price: "",
      quad_price: "",
      quint_price: "",
    });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      days: Number(form.days),
      price: Number(form.price),
      visa_price: Number(form.visa_price),
    };
    if (editing) {
      await fetch("/api/agent/packages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, id: editing.id }),
      });
    } else {
      await fetch("/api/agent/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    resetForm();
    fetchPackages();
  };

  const handleEdit = (pkg: UmrahPackage) => {
    setForm({
      title: pkg.title,
      airline: pkg.airline,
      departure_date: pkg.departure_date,
      return_date: pkg.return_date,
      days: String(pkg.days || ""),
      price: String(pkg.price),
      visa_price: String(pkg.visa_price || 0),
      hotel_makkah: pkg.hotel_makkah || "",
      hotel_madina: pkg.hotel_madina || "",
      image_url: pkg.image_url || "",
      sharing_price: String(pkg.sharing_price || ""),
      double_price: String(pkg.double_price || ""),
      triple_price: String(pkg.triple_price || ""),
      quad_price: String(pkg.quad_price || ""),
      quint_price: String(pkg.quint_price || ""),
    });
    setEditing(pkg);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this package?")) return;
    await fetch(`/api/agent/packages?id=${id}`, { method: "DELETE" });
    fetchPackages();
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#0c1d4a]">My Packages</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          <Plus size={16} /> Add Package
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">{editing ? "Edit Package" : "Add Package"}</h2>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input required placeholder="Airline" value={form.airline} onChange={(e) => setForm({ ...form, airline: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input required type="date" value={form.departure_date} onChange={(e) => setForm({ ...form, departure_date: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input required type="date" value={form.return_date} onChange={(e) => setForm({ ...form, return_date: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input required type="number" placeholder="Days" value={form.days} onChange={(e) => setForm({ ...form, days: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input required type="number" placeholder="Price (base)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input type="number" placeholder="Visa Price" value={form.visa_price} onChange={(e) => setForm({ ...form, visa_price: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input placeholder="Hotel Makkah" value={form.hotel_makkah} onChange={(e) => setForm({ ...form, hotel_makkah: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input placeholder="Hotel Madina" value={form.hotel_madina} onChange={(e) => setForm({ ...form, hotel_madina: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input placeholder="Image URL (Unsplash)" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input type="number" placeholder="Sharing Price" value={form.sharing_price} onChange={(e) => setForm({ ...form, sharing_price: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input type="number" placeholder="Double Price" value={form.double_price} onChange={(e) => setForm({ ...form, double_price: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input type="number" placeholder="Triple Price" value={form.triple_price} onChange={(e) => setForm({ ...form, triple_price: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input type="number" placeholder="Quad Price" value={form.quad_price} onChange={(e) => setForm({ ...form, quad_price: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input type="number" placeholder="Quint Price" value={form.quint_price} onChange={(e) => setForm({ ...form, quint_price: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <div className="md:col-span-3 flex justify-end gap-2">
              <button type="button" onClick={resetForm} className="px-4 py-2 border rounded-md text-sm hover:bg-gray-50">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-[#dc2626] text-white rounded-md text-sm hover:bg-[#b91c1c]">{editing ? "Update" : "Create"}</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-lg shadow-md border overflow-hidden">
            {pkg.image_url && (
              <img src={pkg.image_url} alt={pkg.title} className="w-full h-40 object-cover" />
            )}
            <div className="bg-[#dc2626] text-white px-4 py-2 flex items-center justify-between">
              <span className="font-bold">{pkg.airline}</span>
              <span className="text-sm">{pkg.days} Days</span>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-[#0c1d4a] mb-1">{pkg.title}</h3>
              <div className="text-xs text-gray-500 space-y-1 mb-3">
                <p><strong>Departure:</strong> {pkg.departure_date}</p>
                <p><strong>Return:</strong> {pkg.return_date}</p>
                <p><strong>Makkah:</strong> {pkg.hotel_makkah || "N/A"}</p>
                <p><strong>Madina:</strong> {pkg.hotel_madina || "N/A"}</p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t">
                <div>
                  <p className="text-[10px] text-gray-500">Base Price</p>
                  <p className="text-lg font-bold text-[#dc2626]">PKR {Number(pkg.price).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(pkg)} className="text-blue-500 hover:text-blue-700"><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(pkg.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {packages.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Package size={48} className="mx-auto mb-3 text-gray-300" />
          <p>No packages yet. Create your first package above.</p>
        </div>
      )}
    </div>
  );
}
