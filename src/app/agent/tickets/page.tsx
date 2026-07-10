"use client";

import { useEffect, useState } from "react";
import { Plane, Clock, MapPin, Users, CheckCircle2, XCircle } from "lucide-react";

interface Ticket {
  id: number;
  airline: string;
  flight_no: string;
  from_city: string;
  to_city: string;
  departure_date: string;
  departure_time: string | null;
  return_date: string | null;
  return_time: string | null;
  class: string;
  ticket_type: string;
  price: number;
  available_seats: number;
  notes: string;
}

export default function AgentTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [adults, setAdults] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const fetchTickets = async () => {
    const res = await fetch("/api/agent/tickets");
    const data = await res.json();
    setTickets(data.tickets || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const openBooking = (id: number) => {
    setBookingId(id);
    setAdults(1);
  };

  const closeBooking = () => {
    setBookingId(null);
    setAdults(1);
  };

  const handleBook = async (ticket: Ticket) => {
    setSubmitting(true);
    setToast(null);
    try {
      const fd = new FormData();
      fd.append("type", "ticket");
      fd.append("ticket_id", String(ticket.id));
      fd.append("adults", String(adults));
      const res = await fetch("/api/agent/bookings", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setToast({ type: "error", msg: data.error || "Booking failed" });
      } else {
        setToast({ type: "success", msg: `Ticket booked! Ref: ${data.reference_id} — Total: PKR ${Number(data.total_amount).toLocaleString()}` });
        closeBooking();
        fetchTickets();
      }
    } catch {
      setToast({ type: "error", msg: "Network error" });
    } finally {
      setSubmitting(false);
      setTimeout(() => setToast(null), 6000);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0c1d4a]">Airline Tickets</h1>
        <p className="text-sm text-gray-500 mt-1">
          Browse available airline tickets created by admin and book seats for your clients.
        </p>
      </div>

      {toast && (
        <div className={`mb-4 p-4 rounded-md text-sm flex items-center gap-2 ${toast.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {toast.type === "success" ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          {toast.msg}
        </div>
      )}

      {tickets.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-500">
          No tickets available right now. Please check back later.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-r from-[#1e3a8a] to-[#0c1d4a] text-white p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Plane size={20} className="text-[#dc2626]" />
                    <span className="font-bold text-lg">{t.airline}</span>
                  </div>
                  <span className="text-xs uppercase tracking-wider bg-white/15 px-2 py-1 rounded-full">
                    {t.ticket_type === "round" ? "Round Trip" : "One Way"}
                  </span>
                </div>
                <div className="text-sm text-gray-200 mt-1">Flight {t.flight_no} &middot; <span className="capitalize">{t.class}</span></div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">From</p>
                    <p className="text-lg font-bold text-[#0c1d4a]">{t.from_city}</p>
                  </div>
                  <div className="flex-1 mx-3 flex items-center">
                    <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
                    <Plane size={16} className="text-[#dc2626] mx-2" />
                    <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">To</p>
                    <p className="text-lg font-bold text-[#0c1d4a]">{t.to_city}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={14} className="text-[#dc2626]" />
                    <span>{t.departure_date}{t.departure_time ? ` ${t.departure_time}` : ""}</span>
                  </div>
                  {t.return_date && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={14} className="text-[#dc2626]" />
                      <span>Return: {t.return_date}{t.return_time ? ` ${t.return_time}` : ""}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users size={14} className="text-[#dc2626]" />
                    <span>{t.available_seats} seats available</span>
                  </div>
                  {t.notes && (
                    <div className="flex items-center gap-2 text-gray-600 col-span-2">
                      <MapPin size={14} className="text-[#dc2626]" />
                      <span>{t.notes}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-end justify-between pt-4 border-t border-gray-100 mt-auto">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Price / pax</p>
                    <p className="text-2xl font-bold text-[#0c1d4a]">PKR {Number(t.price).toLocaleString()}</p>
                  </div>
                  {bookingId === t.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={t.available_seats}
                        value={adults}
                        onChange={(e) => setAdults(Math.max(1, Math.min(t.available_seats, Number(e.target.value))))}
                        className="w-16 px-2 py-1.5 border rounded-md text-sm"
                      />
                      <button
                        onClick={() => handleBook(t)}
                        disabled={submitting || adults < 1}
                        className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-1.5 rounded-md text-sm font-medium disabled:opacity-50"
                      >
                        {submitting ? "..." : "Confirm"}
                      </button>
                      <button onClick={closeBooking} className="text-gray-400 hover:text-gray-600 px-1">X</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => openBooking(t.id)}
                      disabled={t.available_seats <= 0}
                      className="bg-[#1e3a8a] hover:bg-[#0c1d4a] text-white px-5 py-2 rounded-md text-sm font-semibold disabled:opacity-50"
                    >
                      {t.available_seats <= 0 ? "Sold Out" : "Book Now"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}