"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPass !== confirm) {
      setError("Passwords do not match");
      return;
    }

    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current, new: newPass }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to change password");
      return;
    }

    setSuccess("Password changed successfully");
    setCurrent("");
    setNewPass("");
    setConfirm("");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Change Password</h1>

      <div className="bg-white rounded-lg shadow-sm border p-6 max-w-md">
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-md">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} required className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#dc2626] outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} required minLength={6} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#dc2626] outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#dc2626] outline-none" />
          </div>
          <button type="submit" className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-6 py-2 rounded-md font-medium">
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}
