import { getDashboardStats } from "@/lib/admin-data";
import { getAdminWithPermissions } from "@/lib/admin-auth";
import { Users, Plane, BookOpen, Ticket, MessageSquare } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const { permissions } = await getAdminWithPermissions();

  if (!permissions.includes("dashboard")) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-xl font-bold text-[#0c1d4a] mb-2">Access Denied</h2>
        <p className="text-gray-500 max-w-md">You do not have permission to view this page.</p>
      </div>
    );
  }

  const stats = await getDashboardStats();

  const allCards = [
    { label: "Total Agents", value: stats.agents, icon: Users, color: "bg-blue-500", link: "/admin/agents", permission: "agents" },
    { label: "Umrah Packages", value: stats.packages, icon: Plane, color: "bg-orange-500", link: "/admin/packages", permission: "packages" },
    { label: "Total Bookings", value: stats.bookings, icon: BookOpen, color: "bg-teal-500", link: "/admin/bookings", permission: "bookings" },
    { label: "Airline Tickets", value: stats.tickets, icon: Ticket, color: "bg-purple-500", link: "/admin/tickets", permission: "tickets" },
    { label: "Contact Messages", value: stats.contacts, icon: MessageSquare, color: "bg-indigo-500", link: "/admin/contacts" },
  ];

  const cards = allCards.filter((card) => !card.permission || permissions.includes(card.permission));

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-[#0c1d4a] mb-6">Dashboard Overview</h1>

      <div className="space-y-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.link}
            className="block bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-bold text-gray-700 uppercase tracking-wide">{card.label}</p>
                <p className="text-5xl font-extrabold text-[#0c1d4a] mt-2">{card.value}</p>
              </div>
              <div className={`w-14 h-14 ${card.color} rounded-xl flex items-center justify-center text-white`}>
                <card.icon size={28} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
