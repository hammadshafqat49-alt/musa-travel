"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Plane,
  Hotel,
  BookOpen,
  Ticket,
  FileText,
  Download,
  Settings,
  ChevronDown,
  Info,
  Lock,
  Shield,
} from "lucide-react";
import { useState } from "react";

type ChildItem = { href: string; icon: React.ElementType; label: string };
type ParentItem = { label: string; icon: React.ElementType; children: ChildItem[] };
type MenuItem = ChildItem | ParentItem;

const menuItems: MenuItem[] = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/agents", icon: Users, label: "Agents" },
  { href: "/admin/packages", icon: Plane, label: "Umrah Packages" },
  { href: "/admin/umrah-groups", icon: Plane, label: "Umrah Groups" },
  { href: "/admin/hotels", icon: Hotel, label: "Hotels" },
  { href: "/admin/bookings", icon: BookOpen, label: "Bookings" },
  { href: "/admin/tickets", icon: Ticket, label: "Tickets" },
  { href: "/admin/ledger", icon: FileText, label: "Voucher" },
  { href: "/admin/downloads", icon: Download, label: "Downloads" },
  {
    label: "Settings",
    icon: Settings,
    children: [
      { href: "/admin/settings", icon: Info, label: "System Info" },
      { href: "/admin/settings/password", icon: Lock, label: "Password Change" },
      { href: "/admin/settings/roles", icon: Shield, label: "Roles" },
    ],
  },
];

function isParent(item: MenuItem): item is ParentItem {
  return "children" in item;
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0c1d4a] text-white flex flex-col z-50">
      <div className="p-4 border-b border-gray-700">
        <Link href="/admin" className="flex items-center gap-2">
          <img src="/logo.jpeg" alt="Musa Travel Service" className="h-10 w-auto rounded bg-white p-0.5 object-contain" />
          <div>
            <div className="text-sm font-bold">Musa Travel Service</div>
            <div className="text-[10px] text-gray-400">MANAGEMENT PANEL</div>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => {
            if (isParent(item)) {
              const isOpen = openMenus[item.label] || item.children.some((c) => pathname.startsWith(c.href));
              return (
                <div key={item.label}>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                      item.children.some((c) => pathname.startsWith(c.href))
                        ? "bg-[#dc2626] text-white"
                        : "text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <item.icon size={16} /> {item.label}
                    </span>
                    <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                            pathname === child.href ? "bg-[#dc2626]/20 text-[#dc2626]" : "text-gray-300 hover:bg-gray-700"
                          }`}
                        >
                          <child.icon size={14} /> {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  pathname === item.href ? "bg-[#dc2626] text-white" : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                <item.icon size={16} /> {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
