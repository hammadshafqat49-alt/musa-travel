"use client";
import { withPermission } from "@/lib/with-permission";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface Download {
  id: number;
  title: string;
  file_url: string;
  category: string;
  created_at: string;
}

function AdminDownloadsPage() {
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Download | null>(null);
  const [form, setForm] = useState({ title: "", file_url: "", category: "" });

  const fetchDownloads = async () => {
    const res = await fetch("/api/admin/downloads");
    const data = await res.json();
    setDownloads(data.downloads || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchDownloads();
  }, []);

  const resetForm = () => {
    setForm({ title: "", file_url: "", category: "" });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await fetch("/api/admin/downloads", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, id: editing.id }) });
    } else {
      await fetch("/api/admin/downloads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    resetForm();
    fetchDownloads();
  };

  const handleEdit = (d: Download) => {
    setForm({ title: d.title, file_url: d.file_url || "", category: d.category || "" });
    setEditing(d);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this download?")) return;
    await fetch(`/api/admin/downloads?id=${id}`, { method: "DELETE" });
    fetchDownloads();
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#0c1d4a]">Downloads</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2 rounded-md text-sm font-medium"><Plus size={16} /> Add Download</button>
      </div>
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">{editing ? "Edit Download" : "Add Download"}</h2>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input required placeholder="File URL" value={form.file_url} onChange={(e) => setForm({ ...form, file_url: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
            <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="px-3 py-2 border rounded-md text-sm" />
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
                <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">File URL</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {downloads.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{d.id}</td>
                  <td className="px-4 py-3 font-medium">{d.title}</td>
                  <td className="px-4 py-3">{d.category || "-"}</td>
                  <td className="px-4 py-3"><a href={d.file_url} className="text-blue-500 hover:underline" target="_blank">{d.file_url}</a></td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(d)} className="text-blue-500 hover:text-blue-700"><Pencil size={16} /></button>
                      <button onClick={() => handleDelete(d.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {downloads.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No downloads found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default withPermission(AdminDownloadsPage, 'downloads');
