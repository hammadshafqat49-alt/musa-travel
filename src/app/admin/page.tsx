import { getDashboardStats } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/admin-auth";
import { Users, Plane, BookOpen, Ticket, DollarSign, MessageSquare, TrendingUp } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await requireAdmin();
  const stats = getDashboardStats();

  const cards = [
    { label: "Total Agents", value: stats.agents, icon: Users, color: "bg-blue-500", link: "/admin/agents" },
    { label: "Umrah Packages", value: stats.packages, icon: Plane, color: "bg-orange-500", link: "/admin/packages" },
    { label: "Total Bookings", value: stats.bookings, icon: BookOpen, color: "bg-teal-500", link: "/admin/bookings" },
    { label: "Airline Tickets", value: stats.tickets, icon: Ticket, color: "bg-purple-500", link: "/admin/tickets" },
    { label: "Total Revenue", value: `PKR ${Number(stats.revenue).toLocaleString()}`, icon: DollarSign, color: "bg-green-500", link: "/admin/bookings" },
    { label: "Pending Balance", value: `PKR ${Number(stats.revenue - stats.totalPaid).toLocaleString()}`, icon: TrendingUp, color: "bg-red-500", link: "/admin/ledger" },
    { label: "Contact Messages", value: stats.contacts, icon: MessageSquare, color: "bg-indigo-500", link: "/admin/contacts" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0c1d4a] mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.link}
            className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-xl font-bold text-[#0c1d4a] mt-1">{card.value}</p>
              </div>
              <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center text-white`}>
                <card.icon size={20} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold text-[#0c1d4a] mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Manage Agents", href: "/admin/agents" },
              { label: "Umrah Packages", href: "/admin/packages" },
              { label: "One Way Groups", href: "/admin/one-way-groups" },
              { label: "Umrah Groups", href: "/admin/umrah-groups" },
              { label: "Hotels", href: "/admin/hotels" },
              { label: "Bookings", href: "/admin/bookings" },
              { label: "Tickets", href: "/admin/tickets" },
              { label: "Downloads", href: "/admin/downloads" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block p-3 bg-gray-50 rounded-md text-sm font-medium text-[#0c1d4a] hover:bg-[#dc2626]/10 hover:text-[#dc2626] transition-colors"
              >
                {link.label} &rarr;
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold text-[#0c1d4a] mb-4">System Info</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Admin Panel Version</span>
              <span className="font-medium">v1.0</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Database</span>
              <span className="font-medium">SQLite</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Environment</span>
              <span className="font-medium">{process.env.NODE_ENV || "development"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Default Admin</span>
              <span className="font-medium">admin / admin123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
