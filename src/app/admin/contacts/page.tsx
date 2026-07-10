"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  created_at: string;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    const res = await fetch("/api/admin/contacts");
    const data = await res.json();
    setContacts(data.contacts || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this contact message?")) return;
    await fetch(`/api/admin/contacts?id=${id}`, { method: "DELETE" });
    fetchContacts();
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0c1d4a] mb-6">Contact Messages</h1>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">ID</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Phone</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Subject</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Message</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {contacts.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{c.id}</td>
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3">{c.email || "-"}</td>
                  <td className="px-4 py-3">{c.phone || "-"}</td>
                  <td className="px-4 py-3">{c.subject || "-"}</td>
                  <td className="px-4 py-3 max-w-xs truncate">{c.message || "-"}</td>
                  <td className="px-4 py-3">{c.created_at ? new Date(c.created_at).toLocaleDateString() : "-"}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
              {contacts.length === 0 && <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500">No messages found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
