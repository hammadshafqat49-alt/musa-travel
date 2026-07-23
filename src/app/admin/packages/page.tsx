"use client";
import { withPermission } from "@/lib/with-permission";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Upload, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PackageCard from "@/components/shared/package-card";
import { UmrahPackage, Hotel } from "@/lib/package-types";

interface Package {
  id: number;
  title: string;
  airline: string;
  departure_date: string;
  return_date: string;
  days: number;
  price: number;
  hotel_makkah: string;
  hotel_madina: string;
  makkah_nights: number;
  madina_nights: number;
  from_city: string;
  to_city: string;
  seats: number;
  makkah_hotel_distance: string;
  madina_hotel_distance: string;
  status: string;
  image_url: string;
  sharing_price: number;
  double_price: number;
  triple_price: number;
  quad_price: number;
}

function AdminPackagesPage() {
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Package | null>(null);
  const [previewPkg, setPreviewPkg] = useState<Package | null>(null);
  const [form, setForm] = useState({
    title: "",
    airline: "",
    departure_date: "",
    return_date: "",
    days: "",
    price: "",
    hotel_makkah: "",
    hotel_madina: "",
    makkah_nights: "",
    madina_nights: "",
    from_city: "",
    to_city: "",
    seats: "",
    makkah_hotel_distance: "",
    madina_hotel_distance: "",
    status: "active",
    image_url: "",
    sharing_price: "",
    double_price: "",
    triple_price: "",
    quad_price: "",
  });

  const fetchPackages = async () => {
    const res = await fetch("/api/admin/packages");
    const data = await res.json();
    setPackages(data.packages || []);
    setLoading(false);
  };

  const fetchHotels = async () => {
    const res = await fetch("/api/admin/hotels");
    const data = await res.json();
    setHotels(data.hotels || []);
  };

  useEffect(() => {
    fetchPackages();
    fetchHotels();
  }, []);

  const resetForm = () => {
    setForm({ title: "", airline: "", departure_date: "", return_date: "", days: "", price: "", hotel_makkah: "", hotel_madina: "", makkah_nights: "", madina_nights: "", from_city: "", to_city: "", seats: "", makkah_hotel_distance: "", madina_hotel_distance: "", status: "active", image_url: "", sharing_price: "", double_price: "", triple_price: "", quad_price: "" });
    setEditing(null);
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
    setLoading(true);
    try {
      const payload = {
        ...form,
        days: Number(form.days),
        price: Number(form.price),
        makkah_nights: Number(form.makkah_nights),
        madina_nights: Number(form.madina_nights),
        seats: Number(form.seats),
        sharing_price: Number(form.sharing_price),
        double_price: Number(form.double_price),
        triple_price: Number(form.triple_price),
        quad_price: Number(form.quad_price),
      };
      const res = await fetch("/api/admin/packages", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing ? { ...payload, id: editing.id } : payload),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to save package");
        return;
      }
      resetForm();
      fetchPackages();
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pkg: Package) => {
    setForm({
      title: pkg.title,
      airline: pkg.airline,
      departure_date: pkg.departure_date,
      return_date: pkg.return_date,
      days: String(pkg.days || ""),
      price: String(pkg.price),
      hotel_makkah: pkg.hotel_makkah || "",
      hotel_madina: pkg.hotel_madina || "",
      makkah_hotel_distance: pkg.makkah_hotel_distance || "",
      madina_hotel_distance: pkg.madina_hotel_distance || "",
      makkah_nights: String(pkg.makkah_nights ?? ""),
      madina_nights: String(pkg.madina_nights ?? ""),
      from_city: pkg.from_city || "",
      to_city: pkg.to_city || "",
      seats: String(pkg.seats ?? ""),
      status: pkg.status || "active",
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
    await fetch(`/api/admin/packages?id=${id}`, { method: "DELETE" });
    fetchPackages();
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#0c1d4a]">Umrah Packages</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2 rounded-md text-sm font-medium">
          <Plus size={16} /> Add Package
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">{editing ? "Edit Package" : "Add Package"}</h2>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Title *</label>
              <input required placeholder="e.g. Deluxe Umrah Package" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Airline *</label>
              <input required placeholder="e.g. Saudi Airlines" value={form.airline} onChange={(e) => setForm({ ...form, airline: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Departure Date *</label>
              <input required type="date" value={form.departure_date} onChange={(e) => setForm({ ...form, departure_date: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Return Date</label>
              <input type="date" value={form.return_date} onChange={(e) => setForm({ ...form, return_date: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Days *</label>
              <input required type="number" placeholder="e.g. 15" value={form.days} onChange={(e) => setForm({ ...form, days: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Base Price (PKR) *</label>
              <input required type="number" placeholder="e.g. 150000" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Hotel Makkah</label>
              <input placeholder="e.g. Hilton Makkah" value={form.hotel_makkah} onChange={(e) => setForm({ ...form, hotel_makkah: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Hotel Madina</label>
              <input placeholder="e.g. Anwar Al Madina" value={form.hotel_madina} onChange={(e) => setForm({ ...form, hotel_madina: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Makkah Hotel Distance</label>
              <input placeholder="e.g. 100 Meters" value={form.makkah_hotel_distance} onChange={(e) => setForm({ ...form, makkah_hotel_distance: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Madina Hotel Distance</label>
              <input placeholder="e.g. 150 Meters" value={form.madina_hotel_distance} onChange={(e) => setForm({ ...form, madina_hotel_distance: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Makkah Nights</label>
              <input type="number" placeholder="e.g. 6" value={form.makkah_nights} onChange={(e) => setForm({ ...form, makkah_nights: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Madina Nights</label>
              <input type="number" placeholder="e.g. 3" value={form.madina_nights} onChange={(e) => setForm({ ...form, madina_nights: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0c1d4a] mb-1">From City/Country</label>
              <input placeholder="e.g. Lahore" value={form.from_city} onChange={(e) => setForm({ ...form, from_city: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0c1d4a] mb-1">To City/Country</label>
              <input placeholder="e.g. Jeddah" value={form.to_city} onChange={(e) => setForm({ ...form, to_city: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Seats</label>
              <input type="number" placeholder="e.g. 50" value={form.seats} onChange={(e) => setForm({ ...form, seats: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Package Image</label>
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

            <div>
              <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Sharing Price (PKR)</label>
              <input type="number" placeholder="e.g. 140000" value={form.sharing_price} onChange={(e) => setForm({ ...form, sharing_price: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Double Price (PKR)</label>
              <input type="number" placeholder="e.g. 180000" value={form.double_price} onChange={(e) => setForm({ ...form, double_price: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Triple Price (PKR)</label>
              <input type="number" placeholder="e.g. 170000" value={form.triple_price} onChange={(e) => setForm({ ...form, triple_price: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Quad Price (PKR)</label>
              <input type="number" placeholder="e.g. 160000" value={form.quad_price} onChange={(e) => setForm({ ...form, quad_price: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
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
                <th className="text-left px-4 py-3 font-bold text-gray-700">ID</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Image</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Title</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Airline</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Departure</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Return</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">From / To</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Seats</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Hotel Distance</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Days</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Price</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Status</th>
                <th className="text-right px-4 py-3 font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{pkg.id}</td>
                  <td className="px-4 py-3">
                    {pkg.image_url ? (
                      <img src={pkg.image_url} alt={pkg.title} className="w-14 h-10 object-cover rounded" />
                    ) : (
                      <div className="w-14 h-10 bg-gray-200 rounded flex items-center justify-center text-[10px] text-gray-400">No img</div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{pkg.title}</td>
                  <td className="px-4 py-3">{pkg.airline}</td>
                  <td className="px-4 py-3">{pkg.departure_date}</td>
                  <td className="px-4 py-3">{pkg.return_date || "-"}</td>
                  <td className="px-4 py-3">{pkg.from_city || "-"} → {pkg.to_city || "-"}</td>
                  <td className="px-4 py-3">{pkg.seats ?? "-"}</td>
                  <td className="px-4 py-3">{pkg.makkah_hotel_distance || "-"} / {pkg.madina_hotel_distance || "-"}</td>
                  <td className="px-4 py-3">{pkg.days}</td>
                  <td className="px-4 py-3">PKR {Number(pkg.price).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${pkg.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {pkg.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setPreviewPkg(pkg)} className="text-emerald-500 hover:text-emerald-700" title="Preview"><Eye size={16} /></button>
                      <button onClick={() => handleEdit(pkg)} className="text-blue-500 hover:text-blue-700" title="Edit"><Pencil size={16} /></button>
                      <button onClick={() => handleDelete(pkg.id)} className="text-red-500 hover:text-red-700" title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {packages.length === 0 && <tr><td colSpan={13} className="px-4 py-8 text-center text-gray-500">No packages found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {previewPkg && (
        <Dialog open={!!previewPkg} onOpenChange={(open) => !open && setPreviewPkg(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Package Preview</DialogTitle>
            </DialogHeader>
            <PackageCard pkg={previewPkg as UmrahPackage} hotels={hotels} variant="admin" />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
export default withPermission(AdminPackagesPage, 'packages');
