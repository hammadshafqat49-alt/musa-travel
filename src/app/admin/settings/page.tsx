"use client";

import { useState } from "react";

export default function AdminSettingsPage() {
  const [message, setMessage] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [credError, setCredError] = useState("");
  const [credSuccess, setCredSuccess] = useState("");

  const handleResetDb = async () => {
    if (!confirm("WARNING: This will reset and re-seed the database. Continue?")) return;
    try {
      const res = await fetch("/api/admin/settings/reset-db", { method: "POST" });
      const data = await res.json();
      setMessage(data.success ? "Database reset successfully. Please restart the dev server." : data.error || "Failed");
    } catch {
      setMessage("Error resetting database.");
    }
  };

  const handleChangeCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredError("");
    setCredSuccess("");

    try {
      const res = await fetch("/api/admin/settings/change-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, username, email, newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCredError(data.error || "Failed to update credentials");
        return;
      }
      setCredSuccess("Credentials updated successfully");
      setCurrentPassword("");
      setUsername("");
      setEmail("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setCredError("Error updating credentials");
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-[#0c1d4a] mb-6">Settings</h1>

      <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl">
        <h2 className="text-lg font-bold mb-4">Change Admin Credentials</h2>
        {credError && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md">{credError}</div>}
        {credSuccess && <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-md">{credSuccess}</div>}

        <form onSubmit={handleChangeCredentials} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password *</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#dc2626] outline-none text-sm"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#dc2626] outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#dc2626] outline-none text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#dc2626] outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#dc2626] outline-none text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-6 py-2 rounded-md font-medium text-sm transition-colors"
          >
            Update Credentials
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl">
        <h2 className="text-lg font-bold mb-4">System Settings</h2>
        <div className="space-y-4">
          <div className="border rounded-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Reset Database</h3>
                <p className="text-sm text-gray-500">Re-run initDb and seedDb. Warning: this is destructive.</p>
              </div>
              <button
                onClick={handleResetDb}
                className="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-2">Default Credentials</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium">Admin:</span> username: admin, password: admin123</p>
              <p><span className="font-medium">Agent:</span> code: 7902, email: hafizmuhammadsiddique7@gmail.com, password: 1781025612</p>
            </div>
          </div>
        </div>

        {message && (
          <div className="mt-4 p-3 bg-blue-50 text-blue-700 text-sm rounded-md">{message}</div>
        )}
      </div>
    </div>
  );
}
