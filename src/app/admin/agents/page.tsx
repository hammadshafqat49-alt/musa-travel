"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface Agent {
  id: number;
  code: string;
  email: string;
  agency_name: string;
  contact_person: string;
  phone: string;
  city: string;
  country: string;
  balance: number;
  created_at: string;
}

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Agent | null>(null);
  const [form, setForm] = useState({
    code: "",
    email: "",
    password: "",
    agency_name: "",
    contact_person: "",
    phone: "",
    city: "",
    country: "",
    balance: "0",
  });

  const fetchAgents = async () => {
    const res = await fetch("/api/admin/agents");
    const data = await res.json();
    setAgents(data.agents || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const resetForm = () => {
    setForm({ code: "", email: "", password: "", agency_name: "", contact_person: "", phone: "", city: "", country: "", balance: "0" });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, balance: Number(form.balance) };
    if (editing) {
      await fetch("/api/admin/agents", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, id: editing.id }),
      });
    } else {
      await fetch("/api/admin/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    resetForm();
    fetchAgents();
  };

  const handleEdit = (agent: Agent) => {
    setForm({
      code: agent.code,
      email: agent.email,
      password: "",
      agency_name: agent.agency_name || "",
      contact_person: agent.contact_person || "",
      phone: agent.phone || "",
      city: agent.city || "",
      country: agent.country || "",
      balance: String(agent.balance || 0),
    });
    setEditing(agent);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this agent?")) return;
    await fetch(`/api/admin/agents?id=${id}`, { method: "DELETE" });
    fetchAgents();
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#0c1d4a]">Agents Management</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Add Agent
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold">{editing ? "Edit Agent" : "Add New Agent"}</h2>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            The agent logs in with <strong>Agent Code</strong> + <strong>Email</strong> + <strong>Password</strong>. Share these three with the agent.
          </p>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Agent Code (username) *</label>
              <input required placeholder="e.g. 7902" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Email *</label>
              <input required type="email" placeholder="agent@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#dc2626] mb-1">Password *</label>
              <input required={!editing} type="password" placeholder={editing ? "Leave blank to keep current" : "Set a password for the agent"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-3 py-2 border-2 border-[#dc2626]/50 rounded-md text-sm bg-red-50/30" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Agency Name</label>
              <input placeholder="Agency Name" value={form.agency_name} onChange={(e) => setForm({ ...form, agency_name: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Contact Person</label>
              <input placeholder="Contact Person" value={form.contact_person} onChange={(e) => setForm({ ...form, contact_person: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Phone</label>
              <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0c1d4a] mb-1">City</label>
              <input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Country</label>
              <input placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Balance (PKR)</label>
              <input type="number" placeholder="0" value={form.balance} onChange={(e) => setForm({ ...form, balance: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
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
                <th className="text-left px-4 py-3 font-bold text-gray-700">Code</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Agency</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Email</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Contact</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Phone</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">City</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Balance</th>
                <th className="text-right px-4 py-3 font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {agents.map((agent) => (
                <tr key={agent.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{agent.id}</td>
                  <td className="px-4 py-3 font-medium">{agent.code}</td>
                  <td className="px-4 py-3">{agent.agency_name || "-"}</td>
                  <td className="px-4 py-3">{agent.email}</td>
                  <td className="px-4 py-3">{agent.contact_person || "-"}</td>
                  <td className="px-4 py-3">{agent.phone || "-"}</td>
                  <td className="px-4 py-3">{agent.city || "-"}</td>
                  <td className="px-4 py-3">PKR {Number(agent.balance).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(agent)} className="text-blue-500 hover:text-blue-700"><Pencil size={16} /></button>
                      <button onClick={() => handleDelete(agent.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {agents.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-500">No agents found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
