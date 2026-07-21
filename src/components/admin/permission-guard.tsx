"use client";

import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";

export default function PermissionGuard({
  permission,
  children,
}: {
  permission: string;
  children: React.ReactNode;
}) {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/me")
      .then(async (res) => {
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setPermissions(data.permissions || []);
      })
      .catch(() => {
        setPermissions([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading...</div>;
  }

  if (!permissions.includes(permission)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <ShieldAlert size={48} className="text-[#dc2626] mb-4" />
        <h2 className="text-xl font-bold text-[#0c1d4a] mb-2">Access Denied</h2>
        <p className="text-gray-500 max-w-md">
          You do not have permission to view this page. Please contact your administrator.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
