"use client";

import { useEffect, useState } from "react";
import { Plus, X, Package } from "lucide-react";
import PackageCard from "@/components/shared/package-card";
import { UmrahPackage, Hotel } from "@/lib/package-types";

export default function AgentPackagesPage() {
  const [packages, setPackages] = useState<UmrahPackage[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
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
    hotel_makkah: "",
    hotel_madina: "",
    makkah_hotel_distance: "",
    madina_hotel_distance: "",
    makkah_nights: "",
    madina_nights: "",
    image_url: "",
    sharing_price: "",
    double_price: "",
    triple_price: "",
    quad_price: "",
  });

  const fetchPackages = async () => {
    const res = await fetch("/api/agent/packages");
    const data = await res.json();
    setPackages(data.packages || []);
    setLoading(false);
  };

  const fetchHotels = async () => {
    const res = await fetch("/api/public/hotels");
    const data = await res.json();
    setHotels(data.hotels || []);
  };

  useEffect(() => {
    fetchPackages();
    fetchHotels();
  }, []);

  const resetForm = () => {
    setForm({
      title: "",
      airline: "",
      departure_date: "",
      return_date: "",
      days: "",
      price: "",
      hotel_makkah: "",
      hotel_madina: "",
      makkah_hotel_distance: "",
      madina_hotel_distance: "",
      makkah_nights: "",
      madina_nights: "",
      image_url: "",
      sharing_price: "",
      double_price: "",
      triple_price: "",
      quad_price: "",
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
      makkah_nights: Number(form.makkah_nights),
      madina_nights: Number(form.madina_nights),
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
      return_date: pkg.return_date || "",
      days: String(pkg.days || ""),
      price: String(pkg.price),
      hotel_makkah: pkg.hotel_makkah || "",
      hotel_madina: pkg.hotel_madina || "",
      makkah_hotel_distance: pkg.makkah_hotel_distance || "",
      madina_hotel_distance: pkg.madina_hotel_distance || "",
      makkah_nights: String(pkg.makkah_nights || ""),
      madina_nights: String(pkg.madina_nights || ""),
      image_url: pkg.image_url || "",
      sharing_price: String(pkg.sharing_price || ""),
      double_price: String(pkg.double_price || ""),
      triple_price: String(pkg.triple_price || ""),
      quad_price: String(pkg.quad_price || ""),
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
            <input placeholder="Hotel Makkah" value={form.hotel_makkah} onChange={(e) => setForm({ ...form, hotel_makkah: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input placeholder="Hotel Madina" value={form.hotel_madina} onChange={(e) => setForm({ ...form, hotel_madina: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input placeholder="Makkah Hotel Distance" value={form.makkah_hotel_distance} onChange={(e) => setForm({ ...form, makkah_hotel_distance: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input placeholder="Madina Hotel Distance" value={form.madina_hotel_distance} onChange={(e) => setForm({ ...form, madina_hotel_distance: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input type="number" placeholder="Makkah Nights" value={form.makkah_nights} onChange={(e) => setForm({ ...form, makkah_nights: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input type="number" placeholder="Madina Nights" value={form.madina_nights} onChange={(e) => setForm({ ...form, madina_nights: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input placeholder="Image URL (Unsplash)" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <PackageCard
            key={pkg.id}
            pkg={pkg}
            hotels={hotels}
            onEdit={() => handleEdit(pkg)}
            onDelete={() => handleDelete(pkg.id)}
          />
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
