"use client";

import { useEffect, useState } from "react";

import AdminSidebar from "@/components/admin/sidebar";
import AdminHeader from "@/components/admin/header";
import { cn } from "@/lib/utils";

export default function AdminShell({
  children,
  permissions,
}: {
  children: React.ReactNode;
  permissions: string[];
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("admin-sidebar-collapsed") : null;
    if (saved !== null) {
      setCollapsed(saved === "true");
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("admin-sidebar-collapsed", String(collapsed));
    }
  }, [collapsed]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar
        permissions={permissions}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        onCollapseToggle={() => setCollapsed((prev) => !prev)}
      />
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-200 ease-in-out",
          collapsed ? "md:ml-16" : "md:ml-64"
        )}
      >
        <AdminHeader
          onMenuToggle={() => setMobileOpen(true)}
        />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
