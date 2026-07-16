"use client";

import { useRef } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Download } from "lucide-react";
import { logoBase64 } from "./logo-base64";

interface LedgerEntry {
  id: number;
  date: string;
  type: string;
  description: string;
  amount: number;
  balance: number;
}

interface Agent {
  agency_name?: string;
  email?: string;
  phone?: string;
  contact_person?: string;
}

export default function LedgerClient({
  entries,
  agent,
}: {
  entries: LedgerEntry[];
  agent: Agent;
}) {
  const tableRef = useRef<HTMLTableElement>(null);

  const downloadPDF = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 36;
    const contentWidth = pageWidth - margin * 2;

    // Colors
    const primaryBlue: [number, number, number] = [12, 29, 74]; // #0c1d4a
    const accentRed: [number, number, number] = [220, 38, 38]; // #dc2626
    const lightBlue: [number, number, number] = [230, 240, 255];

    // --- Header background ---
    doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    doc.rect(0, 0, pageWidth, 120, "F");

    // --- Logo ---
    doc.addImage(logoBase64, "PNG", margin, 20, 40, 35);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("MUSA TRAVEL SERVICE", margin + 55, 45);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Ministry of Hajj Approved Operator | IATA Certified", margin + 55, 62);
    doc.text("Gulberg 3, Main Boulevard, Eden Tower LGF 6/8, Lahore", margin + 55, 77);
    doc.text("Phone: 0333 4390349 / 03390000007", margin + 55, 92);

    // --- Agent info box ---
    const agentBoxY = 135;
    doc.setFillColor(lightBlue[0], lightBlue[1], lightBlue[2]);
    doc.setDrawColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    doc.setLineWidth(1);
    doc.roundedRect(margin, agentBoxY, contentWidth, 55, 4, 4, "FD");

    doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("AGENT STATEMENT", margin + 8, agentBoxY + 18);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const agencyName = agent.agency_name || "N/A";
    const contact = agent.contact_person || "N/A";
    const email = agent.email || "N/A";
    const phone = agent.phone || "N/A";
    doc.text(`Agency: ${agencyName}   |   Contact: ${contact}`, margin + 8, agentBoxY + 34);
    doc.text(`Email: ${email}   |   Phone: ${phone}`, margin + 8, agentBoxY + 48);

    // --- Title ---
    doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("LEDGER STATEMENT", margin, 220);

    // --- Date ---
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString("en-GB")}`, margin, 235);

    // --- Table ---
    const tableData = entries.map((e) => [
      e.date?.split("T")[0] || "-",
      e.type.toUpperCase(),
      e.description || "-",
      `PKR ${e.amount.toLocaleString()}`,
    ]);

    autoTable(doc, {
      startY: 250,
      head: [["Date", "Type", "Description", "Amount"]],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: primaryBlue,
        textColor: 255,
        fontStyle: "bold",
        fontSize: 9,
        halign: "center",
      },
      bodyStyles: {
        fontSize: 9,
        textColor: 40,
      },
      alternateRowStyles: {
        fillColor: [245, 250, 255],
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 70 },
        1: { halign: "center", cellWidth: 60 },
        2: { halign: "left", cellWidth: "auto" },
        3: { halign: "right", cellWidth: 110 },
      },
      styles: {
        lineColor: primaryBlue,
        lineWidth: 0.5,
      },
      margin: { left: margin, right: margin },
    });

    // --- Footer on every page ---
    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
      doc.rect(0, doc.internal.pageSize.getHeight() - 30, pageWidth, 30, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(
        "Musa Travel Service | travelwithmusa.com | Page " + i + " of " + pageCount,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 12,
        { align: "center" }
      );
    }

    doc.save(`voucher-${agent.agency_name || "agent"}-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#0c1d4a]">Voucher</h1>
        <button
          onClick={downloadPDF}
          className="flex items-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          <Download size={16} /> Download PDF
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="overflow-x-auto">
          <table ref={tableRef} className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3">Date</th>
                <th className="text-left py-2 px-3">Type</th>
                <th className="text-left py-2 px-3">Description</th>
                <th className="text-right py-2 px-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                    No voucher entries found.
                  </td>
                </tr>
              ) : (
                entries.map((e) => (
                  <tr key={e.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-3">{e.date?.split("T")[0]}</td>
                    <td className="py-2 px-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          e.type === "credit"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {e.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-2 px-3">{e.description || "-"}</td>
                    <td className="py-2 px-3 text-right font-medium">
                      PKR {e.amount.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
