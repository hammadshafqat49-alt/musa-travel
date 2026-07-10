"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface Group {
  id: number;
  title: string;
  departure_date: string;
  return_date: string;
  airline: string;
  price: number;
  days: number;
  seats: number;
  available_seats: number;
  status: string;
}

export default function AdminUmrahGroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Group | null>(null);
  const [form, setForm] = useState({
    title: "", departure_date: "", return_date: "", airline: "", price: "", days: "", seats: "", available_seats: "", status: "active",
  });

  const fetchGroups = async () => {
    const res = await fetch("/api/admin/umrah-groups");
    const data = await res.json();
    setGroups(data.groups || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const resetForm = () => {
    setForm({ title: "", departure_date: "", return_date: "", airline: "", price: "", days: "", seats: "", available_seats: "", status: "active" });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price), days: Number(form.days), seats: Number(form.seats), available_seats: Number(form.available_seats) };
    if (editing) {
      await fetch("/api/admin/umrah-groups", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, id: editing.id }) });
    } else {
      await fetch("/api/admin/umrah-groups", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    }
    resetForm();
    fetchGroups();
  };

  const handleEdit = (g: Group) => {
    setForm({
      title: g.title, departure_date: g.departure_date, return_date: g.return_date || "",
      airline: g.airline || "", price: String(g.price), days: String(g.days || 0),
      seats: String(g.seats || 0), available_seats: String(g.available_seats || 0), status: g.status || "active",
    });
    setEditing(g);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this group?")) return;
    await fetch(`/api/admin/umrah-groups?id=${id}`, { method: "DELETE" });
    fetchGroups();
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#0c1d4a]">Umrah Groups</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2 rounded-md text-sm font-medium"><Plus size={16} /> Add Group</button>
      </div>
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">{editing ? "Edit Group" : "Add Group"}</h2>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input required type="date" value={form.departure_date} onChange={(e) => setForm({ ...form, departure_date: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input type="date" value={form.return_date} onChange={(e) => setForm({ ...form, return_date: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input placeholder="Airline" value={form.airline} onChange={(e) => setForm({ ...form, airline: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input required type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input type="number" placeholder="Days" value={form.days} onChange={(e) => setForm({ ...form, days: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input type="number" placeholder="Seats" value={form.seats} onChange={(e) => setForm({ ...form, seats: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input type="number" placeholder="Available Seats" value={form.available_seats} onChange={(e) => setForm({ ...form, available_seats: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="px-3 py-2 border rounded-md text-sm">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
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
                <th className="text-left px-4 py-3 font-medium text-gray-600">Title</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Departure</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Return</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Airline</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Price</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Days</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Seats</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {groups.map((g) => (
                <tr key={g.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{g.id}</td>
                  <td className="px-4 py-3 font-medium">{g.title}</td>
                  <td className="px-4 py-3">{g.departure_date}</td>
                  <td className="px-4 py-3">{g.return_date || "-"}</td>
                  <td className="px-4 py-3">{g.airline || "-"}</td>
                  <td className="px-4 py-3">PKR {Number(g.price).toLocaleString()}</td>
                  <td className="px-4 py-3">{g.days}</td>
                  <td className="px-4 py-3">{g.available_seats}/{g.seats}</td>
                  <td className="px-4 py-3"><span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${g.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{g.status}</span></td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(g)} className="text-blue-500 hover:text-blue-700"><Pencil size={16} /></button>
                      <button onClick={() => handleDelete(g.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {groups.length === 0 && <tr><td colSpan={10} className="px-4 py-8 text-center text-gray-500">No groups found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
