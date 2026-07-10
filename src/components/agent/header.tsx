"use client";

import Link from "next/link";
import { User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AgentHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/agent/login");
    router.refresh();
  };

  return (
    <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
      <div className="text-sm text-gray-500">
        <Link href="/agent" className="hover:text-[#dc2626]">Home</Link>
        <span className="mx-2">/</span>
        <span>Agent Panel</span>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/agent/profile" className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300">
          <User size={16} className="text-gray-600" />
        </Link>
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
