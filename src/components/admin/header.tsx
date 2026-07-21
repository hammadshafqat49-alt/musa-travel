"use client";

import Link from "next/link";
import { User, LogOut, Menu } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminHeader({
  onMenuToggle,
}: {
  onMenuToggle: () => void;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="text-gray-500 hover:text-[#dc2626] md:hidden"
          title="Open menu"
        >
          <Menu size={20} />
        </button>
        <div className="text-sm text-gray-500">
          <Link href="/admin" className="hover:text-[#dc2626]">Home</Link>
          <span className="mx-2">/</span>
          <span>Admin Panel</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
          <User size={16} className="text-gray-600" />
        </div>
        <button
          onClick={handleLogout}
          className="text-gray-500 hover:text-red-500"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
