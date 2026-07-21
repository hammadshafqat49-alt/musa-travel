"use client";
import { withPermission } from "@/lib/with-permission";

import { useState } from "react";

function AdminSystemInfoPage() {
  const [message, setMessage] = useState("");

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

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-[#0c1d4a] mb-6">System Info</h1>

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
export default withPermission(AdminSystemInfoPage, 'settings');
