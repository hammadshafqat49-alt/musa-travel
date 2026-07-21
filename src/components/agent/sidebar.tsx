"use client";

import {
  LayoutDashboard,
  Package,
  Plane,
  Calendar,
  Users,
  List,
  FileText,
  Hotel,
  UserCircle,
  Settings,
} from "lucide-react";

import AppSidebar, { MenuItem } from "@/components/shared/app-sidebar";

const menuItems: MenuItem[] = [
  { href: "/agent", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/agent/tickets", icon: Plane, label: "Tickets" },
  { href: "/agent/bookings/package", icon: Calendar, label: "Book Packages" },
  { href: "/agent/bookings/umrah", icon: Users, label: "Umrah Groups" },
  { href: "/agent/bookings/all-packages", icon: List, label: "My Bookings" },
  { href: "/agent/hotels", icon: Hotel, label: "Hotels" },
  { href: "/agent/ledger", icon: FileText, label: "Voucher" },
  {
    label: "Settings",
    icon: Settings,
    children: [
      { href: "/agent/profile", icon: UserCircle, label: "My Profile" },
    ],
  },
];

export default function AgentSidebar({
  collapsed,
  mobileOpen,
  onMobileClose,
  onCollapseToggle,
}: {
  collapsed: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
  onCollapseToggle?: () => void;
}) {
  return (
    <AppSidebar
      menuItems={menuItems}
      brandLabel="AGENT PORTAL"
      homeHref="/agent"
      collapsed={collapsed}
      mobileOpen={mobileOpen}
      onMobileClose={onMobileClose}
      onCollapseToggle={onCollapseToggle}
    />
  );
}
