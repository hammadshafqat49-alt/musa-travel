"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Plane,
  Calendar,
  Users,
  List,
  FileText,
  UserCircle,
  KeyRound,
} from "lucide-react";

const menuItems = [
  { href: "/agent", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/agent/tickets", icon: Plane, label: "Tickets" },
  { href: "/agent/bookings/package", icon: Calendar, label: "Book Packages" },
  { href: "/agent/bookings/umrah", icon: Users, label: "Umrah Groups" },
  { href: "/agent/bookings/group", icon: Users, label: "One-way Groups" },
  { href: "/agent/bookings/all-packages", icon: List, label: "My Bookings" },
  { href: "/agent/ledger", icon: FileText, label: "Ledger" },
  { href: "/agent/profile", icon: UserCircle, label: "My Profile" },
  { href: "/agent/change-password", icon: KeyRound, label: "Change Password" },
];

export default function AgentSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0c1d4a] text-white flex flex-col z-50">
      <div className="p-4 border-b border-gray-700">
        <Link href="/agent" className="flex items-center gap-2">
          <img src="/logo.jpeg" alt="Musa Travel Service" className="h-10 w-auto rounded bg-white p-0.5 object-contain" />
          <div>
            <div className="text-sm font-bold">Musa Travel Service</div>
            <div className="text-[10px] text-gray-400">AGENT PORTAL</div>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                pathname === item.href ? "bg-[#dc2626] text-white" : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              <item.icon size={16} /> {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
