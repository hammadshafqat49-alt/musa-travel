"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import AdminShell from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(!isLoginPage);

  useEffect(() => {
    if (isLoginPage) return;

    fetch("/api/admin/me")
      .then(async (res) => {
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setPermissions(data.permissions || []);
      })
      .catch(() => {
        router.push("/admin/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isLoginPage, router]);

  if (isLoginPage) {
    return children;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return <AdminShell permissions={permissions}>{children}</AdminShell>;
}
