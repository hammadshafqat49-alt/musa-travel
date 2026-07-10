"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCw, Download, Plane, Building2, Bus, Calendar, Users, BedDouble, CreditCard, ChevronDown, FileText, MapPin } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface BookingDetail {
  id: number;
  agent_id: number;
  agent_name: string;
  agent_email: string;
  agent_phone: string;
  type: string;
  reference_id: string;
  adults: number;
  infants: number;
  total_amount: number;
  status: string;
  room_type: string;
  notes: string;
  created_at: string;
  // package fields
  package_title: string;
  package_airline: string;
  package_departure: string;
  package_return: string;
  package_days: number;
  package_price: number;
  package_visa_price: number;
  hotel_makkah: string;
  hotel_madina: string;
  transport_included: number;
  image_url: string;
  sharing_price: number;
  double_price: number;
  triple_price: number;
  quad_price: number;
  quint_price: number;
  // one-way group fields
  ow_group_title: string;
  ow_group_destination: string;
  ow_group_airline: string;
  ow_group_departure: string;
  ow_group_price: number;
  ow_group_seats: number;
  // umrah group fields
  umrah_group_title: string;
  umrah_group_airline: string;
  umrah_group_departure: string;
  umrah_group_return: string;
  umrah_group_price: number;
  umrah_group_days: number;
}

interface AgentSummary {
  agent_id: number;
  agent_name: string;
  agent_email: string;
  agent_phone: string;
  total_bookings: number;
  total_amount: number;
  bookings: BookingDetail[];
}

export default function AdminLedgerPage() {
  const [bookings, setBookings] = useState<BookingDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedAgent, setExpandedAgent] = useState<number | null>(null);

  const fetchBookings = async () => {
    const res = await fetch("/api/admin/ledger?view=bookings");
    const data = await res.json();
    setBookings(data.bookings || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const agents = useMemo(() => {
    const map = new Map<number, AgentSummary>();
    bookings.forEach((b) => {
      const existing = map.get(b.agent_id);
      if (existing) {
        existing.total_bookings += 1;
        existing.total_amount += b.total_amount || 0;
        existing.bookings.push(b);
      } else {
        map.set(b.agent_id, {
          agent_id: b.agent_id,
          agent_name: b.agent_name,
          agent_email: b.agent_email,
          agent_phone: b.agent_phone,
          total_bookings: 1,
          total_amount: b.total_amount || 0,
          bookings: [b],
        });
      }
    });
    return Array.from(map.values());
  }, [bookings]);

  const filteredAgents = agents.filter((a) =>
    a.agent_name?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleAgent = (id: number) => {
    setExpandedAgent((prev) => (prev === id ? null : id));
  };

  const downloadAgentPDF = (agent: AgentSummary) => {
    const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 40;

    // ===== HEADER =====
    doc.setFillColor(249, 115, 22);
    doc.rect(0, 0, pageW, 100, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Musa Travel Service", margin, 45);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Agent Booking Ledger", margin, 65);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, 82);

    // ===== AGENT INFO BOX =====
    const boxY = 120;
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(margin, boxY, pageW - margin * 2, 70, 4, 4, "F");

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(agent.agent_name || `Agent #${agent.agent_id}`, margin + 12, boxY + 22);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`Email: ${agent.agent_email || "-"}`, margin + 12, boxY + 40);
    doc.text(`Phone: ${agent.agent_phone || "-"}`, margin + 12, boxY + 55);

    doc.setTextColor(249, 115, 22);
    doc.setFont("helvetica", "bold");
    doc.text(
      `${agent.total_bookings} Bookings`,
      pageW - margin - 110,
      boxY + 22
    );
    doc.text(
      `Total: PKR ${agent.total_amount.toLocaleString()}`,
      pageW - margin - 110,
      boxY + 40
    );

    // ===== BOOKINGS TABLE =====
    const rows = agent.bookings.map((b) => {
      const isPackage = b.type === "package";
      const isGroup = b.type === "group";
      const isUmrah = b.type === "umrah";

      let details = "";
      if (isPackage) {
        details = `Pkg: ${b.package_title || "-"}\nAirline: ${b.package_airline || "-"}\nHotels: ${b.hotel_makkah || "-"} / ${b.hotel_madina || "-"}\nTransport: ${b.transport_included ? "Included" : "Not Included"}\nDates: ${b.package_departure || "-"} to ${b.package_return || "-"}\nRoom: ${b.room_type || "-"}`;
      } else if (isGroup) {
        details = `Group: ${b.ow_group_title || "-"}\nDestination: ${b.ow_group_destination || "-"}\nAirline: ${b.ow_group_airline || "-"}\nDeparture: ${b.ow_group_departure || "-"}`;
      } else if (isUmrah) {
        details = `Group: ${b.umrah_group_title || "-"}\nAirline: ${b.umrah_group_airline || "-"}\nDates: ${b.umrah_group_departure || "-"} to ${b.umrah_group_return || "-"}`;
      }

      return [
        b.reference_id || `BKG-${b.id}`,
        b.type.toUpperCase(),
        `${b.adults}A / ${b.infants}I`,
        details,
        `PKR ${Number(b.total_amount || 0).toLocaleString()}`,
        b.status.toUpperCase(),
        b.created_at ? new Date(b.created_at).toLocaleDateString() : "-",
      ];
    });

    autoTable(doc, {
      startY: boxY + 90,
      margin: { left: margin, right: margin },
      head: [
        [
          "Ref#",
          "Type",
          "Pax",
          "Details (Package / Group Info)",
          "Amount",
          "Status",
          "Date",
        ],
      ],
      body: rows,
      styles: {
        fontSize: 8,
        cellPadding: 6,
        lineColor: [220, 220, 220],
        lineWidth: 0.5,
        valign: "middle",
      },
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: 255,
        fontStyle: "bold",
        fontSize: 9,
      },
      alternateRowStyles: { fillColor: [250, 250, 250] },
      columnStyles: {
        0: { cellWidth: 55 },
        1: { cellWidth: 40, halign: "center" },
        2: { cellWidth: 35, halign: "center" },
        3: { cellWidth: "auto" },
        4: { cellWidth: 55, halign: "right" },
        5: { cellWidth: 45, halign: "center" },
        6: { cellWidth: 45, halign: "center" },
      },
    });

    // ===== ROOM PRICING TABLES (per package booking) =====
    let currentY = (doc as any).lastAutoTable.finalY + 30;
    const packageBookings = agent.bookings.filter((b) => b.type === "package");

    if (packageBookings.length > 0) {
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Package Room Pricing Details", margin, currentY);
      currentY += 20;

      packageBookings.forEach((b, idx) => {
        if (currentY > doc.internal.pageSize.getHeight() - 120) {
          doc.addPage();
          currentY = 40;
        }

        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(249, 115, 22);
        doc.text(`${idx + 1}. ${b.package_title || "Package"} (${b.reference_id || "-"})`, margin, currentY);
        currentY += 14;

        autoTable(doc, {
          startY: currentY,
          margin: { left: margin, right: margin },
          head: [["Room Type", "Sharing", "Double", "Triple", "Quad", "Quint"]],
          body: [
            [
              "Price / Person (PKR)",
              Number(b.sharing_price || b.package_price || 0).toLocaleString(),
              Number(b.double_price || b.package_price || 0).toLocaleString(),
              Number(b.triple_price || b.package_price || 0).toLocaleString(),
              Number(b.quad_price || b.package_price || 0).toLocaleString(),
              Number(b.quint_price || b.package_price || 0).toLocaleString(),
            ],
          ],
          styles: {
            fontSize: 9,
            cellPadding: 5,
            lineColor: [200, 200, 200],
            lineWidth: 0.5,
            halign: "center",
          },
          headStyles: {
            fillColor: [249, 115, 22],
            textColor: 255,
            fontStyle: "bold",
          },
          columnStyles: {
            0: { halign: "left", fontStyle: "bold" },
          },
        });

        currentY = (doc as any).lastAutoTable.finalY + 18;
      });
    }

    // ===== SUMMARY BOX =====
    if (currentY > doc.internal.pageSize.getHeight() - 80) {
      doc.addPage();
      currentY = 40;
    }

    doc.setFillColor(245, 245, 245);
    doc.roundedRect(margin, currentY, pageW - margin * 2, 50, 4, 4, "F");

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("SUMMARY", margin + 12, currentY + 20);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`Total Bookings: ${agent.total_bookings}`, margin + 12, currentY + 38);

    doc.setTextColor(249, 115, 22);
    doc.setFont("helvetica", "bold");
    doc.text(
      `Total Amount: PKR ${agent.total_amount.toLocaleString()}`,
      pageW - margin - 160,
      currentY + 38
    );

    // ===== FOOTER =====
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Musa Travel Service | https://travelwithmusa.com/ | Page ${i} of ${pageCount}`,
        pageW / 2,
        doc.internal.pageSize.getHeight() - 20,
        { align: "center" }
      );
    }

    doc.save(`ledger-${(agent.agent_name || `agent-${agent.agent_id}`).replace(/\s+/g, "-").toLowerCase()}.pdf`);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-[#0c1d4a]">Client Ledger</h1>
        <button
          onClick={fetchBookings}
          className="flex items-center gap-2 text-gray-500 hover:text-[#dc2626] text-sm px-3 py-2 rounded-md border hover:border-[#dc2626] transition-colors w-fit"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <input
          type="text"
          placeholder="Search client by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626]"
        />
      </div>

      {filteredAgents.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center text-gray-500">
          No clients found.
        </div>
      )}

      <div className="space-y-4">
        {filteredAgents.map((agent) => {
          const isExpanded = expandedAgent === agent.agent_id;
          return (
            <div
              key={agent.agent_id}
              className="bg-white rounded-lg shadow-sm border overflow-hidden"
            >
              {/* Agent Header */}
              <div
                onClick={() => toggleAgent(agent.agent_id)}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4 p-5">
                  <div className="w-12 h-12 rounded-full bg-[#dc2626]/10 flex items-center justify-center shrink-0">
                    <Users size={22} className="text-[#dc2626]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#0c1d4a] text-base">
                      {agent.agent_name || `Agent #${agent.agent_id}`}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {agent.agent_email || "-"} · {agent.agent_phone || "-"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#dc2626]">
                        PKR {agent.total_amount.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        {agent.total_bookings} Bookings
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadAgentPDF(agent);
                        }}
                        className="flex items-center gap-1.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                      >
                        <Download size={13} /> PDF
                      </button>
                      <div className="text-gray-400">
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Bookings */}
              {isExpanded && (
                <div className="border-t bg-gray-50/50 p-5">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-[#1e3a8a] text-white">
                        <tr>
                          <th className="text-left px-4 py-2.5 text-xs font-medium">Ref#</th>
                          <th className="text-left px-4 py-2.5 text-xs font-medium">Type</th>
                          <th className="text-left px-4 py-2.5 text-xs font-medium">Pax</th>
                          <th className="text-left px-4 py-2.5 text-xs font-medium">Details</th>
                          <th className="text-left px-4 py-2.5 text-xs font-medium">Amount</th>
                          <th className="text-left px-4 py-2.5 text-xs font-medium">Status</th>
                          <th className="text-left px-4 py-2.5 text-xs font-medium">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y bg-white">
                        {agent.bookings.map((b) => {
                          const isPackage = b.type === "package";
                          const isGroup = b.type === "group";
                          const isUmrah = b.type === "umrah";

                          return (
                            <tr key={b.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium whitespace-nowrap">
                                {b.reference_id || `BKG-${b.id}`}
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase ${
                                    b.type === "package"
                                      ? "bg-blue-100 text-blue-700"
                                      : b.type === "umrah"
                                      ? "bg-purple-100 text-purple-700"
                                      : "bg-orange-100 text-orange-700"
                                  }`}
                                >
                                  {b.type}
                                </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                {b.adults}A / {b.infants}I
                                {b.room_type && (
                                  <span className="block text-[10px] text-gray-500 capitalize mt-0.5">
                                    {b.room_type}
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3 min-w-[260px]">
                                {isPackage && (
                                  <div className="space-y-1">
                                    <p className="text-xs font-medium text-[#0c1d4a]">
                                      {b.package_title || "-"}
                                    </p>
                                    <div className="flex items-center gap-1.5 text-[10px] text-gray-600">
                                      <Plane size={10} className="text-[#dc2626]" />
                                      {b.package_airline || "-"}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] text-gray-600">
                                      <Building2 size={10} className="text-[#dc2626]" />
                                      {b.hotel_makkah || "-"}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] text-gray-600">
                                      <Building2 size={10} className="text-[#0D9488]" />
                                      {b.hotel_madina || "-"}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] text-gray-600">
                                      <Bus size={10} className="text-[#EAB308]" />
                                      Transport: {b.transport_included ? "Included" : "Not Included"}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] text-gray-600">
                                      <Calendar size={10} className="text-[#0D9488]" />
                                      {b.package_departure || "-"} to {b.package_return || "-"}
                                    </div>
                                  </div>
                                )}
                                {isGroup && (
                                  <div className="space-y-1">
                                    <p className="text-xs font-medium text-[#0c1d4a]">
                                      {b.ow_group_title || "-"}
                                    </p>
                                    <div className="flex items-center gap-1.5 text-[10px] text-gray-600">
                                      <MapPin size={10} className="text-[#dc2626]" />
                                      {b.ow_group_destination || "-"}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] text-gray-600">
                                      <Plane size={10} className="text-[#dc2626]" />
                                      {b.ow_group_airline || "-"}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] text-gray-600">
                                      <Calendar size={10} className="text-[#0D9488]" />
                                      {b.ow_group_departure || "-"}
                                    </div>
                                  </div>
                                )}
                                {isUmrah && (
                                  <div className="space-y-1">
                                    <p className="text-xs font-medium text-[#0c1d4a]">
                                      {b.umrah_group_title || "-"}
                                    </p>
                                    <div className="flex items-center gap-1.5 text-[10px] text-gray-600">
                                      <Plane size={10} className="text-[#dc2626]" />
                                      {b.umrah_group_airline || "-"}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] text-gray-600">
                                      <Calendar size={10} className="text-[#0D9488]" />
                                      {b.umrah_group_departure || "-"} to {b.umrah_group_return || "-"}
                                    </div>
                                    <div className="text-[10px] text-gray-600">
                                      {b.umrah_group_days} Days
                                    </div>
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-3 font-semibold text-[#dc2626] whitespace-nowrap">
                                PKR {Number(b.total_amount || 0).toLocaleString()}
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase ${
                                    b.status === "confirmed"
                                      ? "bg-green-100 text-green-700"
                                      : b.status === "pending"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  {b.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                                {b.created_at
                                  ? new Date(b.created_at).toLocaleDateString()
                                  : "-"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Room Pricing (Package bookings only) */}
                  {agent.bookings.some((b) => b.type === "package") && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Room Pricing Per Person (PKR)
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {agent.bookings
                          .filter((b) => b.type === "package")
                          .map((b) => (
                            <div key={b.id} className="bg-white rounded-md border p-3">
                              <p className="text-xs font-medium text-[#0c1d4a] mb-2">
                                {b.package_title || "Package"} ({b.reference_id || "-"})
                              </p>
                              <div className="grid grid-cols-5 text-center divide-x border rounded-md overflow-hidden">
                                {[
                                  { label: "Sharing", val: b.sharing_price || b.package_price || 0 },
                                  { label: "Double", val: b.double_price || b.package_price || 0 },
                                  { label: "Triple", val: b.triple_price || b.package_price || 0 },
                                  { label: "Quad", val: b.quad_price || b.package_price || 0 },
                                  { label: "Quint", val: b.quint_price || b.package_price || 0 },
                                ].map((r) => (
                                  <div key={r.label} className="py-2">
                                    <p className="text-[9px] text-gray-500">{r.label}</p>
                                    <p className="text-xs font-bold text-[#0c1d4a]">
                                      {r.val > 0 ? r.val.toLocaleString() : "-"}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
