"use client";

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
  Info,
  Lock,
  Shield,
} from "lucide-react";

import AppSidebar, { MenuItem } from "@/components/shared/app-sidebar";

const allMenuItems: (MenuItem & { permission?: string })[] = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard", permission: "dashboard" },
  { href: "/admin/agents", icon: Users, label: "Agents", permission: "agents" },
  { href: "/admin/packages", icon: Plane, label: "Umrah Packages", permission: "packages" },
  { href: "/admin/umrah-groups", icon: Plane, label: "Umrah Groups", permission: "umrah_groups" },
  { href: "/admin/hotels", icon: Hotel, label: "Hotels", permission: "hotels" },
  { href: "/admin/bookings", icon: BookOpen, label: "Bookings", permission: "bookings" },
  { href: "/admin/tickets", icon: Ticket, label: "Tickets", permission: "tickets" },
  { href: "/admin/ledger", icon: FileText, label: "Voucher", permission: "ledger" },
  { href: "/admin/downloads", icon: Download, label: "Downloads", permission: "downloads" },
  {
    label: "Settings",
    icon: Settings,
    permission: "settings",
    children: [
      { href: "/admin/settings", icon: Info, label: "System Info" },
      { href: "/admin/settings/password", icon: Lock, label: "Password Change" },
      { href: "/admin/settings/roles", icon: Shield, label: "Roles" },
    ],
  },
];

function filterMenuItems(
  items: (MenuItem & { permission?: string })[],
  permissions: string[]
): MenuItem[] {
  return items.reduce<MenuItem[]>((acc, item) => {
    if (item.permission && !permissions.includes(item.permission)) {
      return acc;
    }

    if ("children" in item) {
      acc.push({
        label: item.label,
        icon: item.icon,
        children: item.children,
      });
    } else {
      acc.push({
        href: item.href,
        icon: item.icon,
        label: item.label,
      });
    }
    return acc;
  }, []);
}

export default function AdminSidebar({
  permissions,
  collapsed,
  mobileOpen,
  onMobileClose,
  onCollapseToggle,
}: {
  permissions: string[];
  collapsed: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
  onCollapseToggle: () => void;
}) {
  const menuItems = filterMenuItems(allMenuItems, permissions);

  return (
    <AppSidebar
      menuItems={menuItems}
      brandLabel="MANAGEMENT PANEL"
      homeHref="/admin"
      collapsed={collapsed}
      mobileOpen={mobileOpen}
      onMobileClose={onMobileClose}
      onCollapseToggle={onCollapseToggle}
    />
  );
}
