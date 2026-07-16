"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Plane,
  Users,
  ArrowRight,
  X,
  Filter,
  CheckCircle2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface UmrahGroup {
  id: number;
  title: string;
  departure_date: string;
  return_date: string | null;
  airline: string | null;
  price: number;
  days: number;
  seats: number;
  available_seats: number;
  status: string;
}

interface Booking {
  id: number;
  reference_id: string;
  group_id: number;
  adults: number;
  infants: number;
  total_amount: number;
  status: string;
  created_at: string;
}

const fallbackImages: Record<string, string> = {
  Saudia: "https://images.unsplash.com/photo-1565058688641-6776481d1b84?w=800&auto=format&fit=crop",
  PIA: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&auto=format&fit=crop",
  Airblue: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop",
  SereneAir: "https://images.unsplash.com/photo-1527612820672-5b56351f7346?w=800&auto=format&fit=crop",
};

export default function UmrahGroupBookingClient({
  groups,
  bookings: initialBookings,
}: {
  groups: UmrahGroup[];
  bookings: Booking[];
}) {
  const router = useRouter();
  const [bookings, setBookings] = useState(initialBookings);

  const allAirlines = useMemo(
    () => Array.from(new Set(groups.map((g) => g.airline).filter((a): a is string => !!a))),
    [groups]
  );
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);

  const [selectedGroup, setSelectedGroup] = useState<UmrahGroup | null>(null);
  const [adults, setAdults] = useState(1);
  const [infants, setInfants] = useState(0);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const filteredGroups = useMemo(() => {
    return groups.filter((g) => {
      if (selectedAirlines.length > 0 && g.airline && !selectedAirlines.includes(g.airline))
        return false;
      return true;
    });
  }, [groups, selectedAirlines]);

  const toggleAirline = (airline: string) => {
    setSelectedAirlines((prev) =>
      prev.includes(airline)
        ? prev.filter((a) => a !== airline)
        : [...prev, airline]
    );
  };

  const openBookModal = (g: UmrahGroup) => {
    setSelectedGroup(g);
    setAdults(1);
    setInfants(0);
    setBookingError("");
    setBookingSuccess(false);
  };

  const closeModal = () => {
    setSelectedGroup(null);
    setBookingError("");
    setBookingSuccess(false);
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup) return;
    setBookingLoading(true);
    setBookingError("");
    try {
      const formData = new FormData();
      formData.append("type", "umrah");
      formData.append("group_id", String(selectedGroup.id));
      formData.append("adults", String(adults));
      formData.append("infants", String(infants));

      const res = await fetch("/api/agent/bookings", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Booking failed");
      }

      setBookingSuccess(true);
      const bookingsRes = await fetch("/api/agent/bookings?type=umrah");
      if (bookingsRes.ok) {
        const data = await bookingsRes.json();
        setBookings(data.bookings || []);
      }
      router.refresh();
      setTimeout(() => closeModal(), 1200);
    } catch (err: any) {
      setBookingError(err.message || "Something went wrong");
    } finally {
      setBookingLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedAirlines([]);
  };

  const hasActiveFilters =
    selectedAirlines.length > 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0c1d4a]">Umrah Groups</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="w-full lg:w-64 shrink-0 space-y-5">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#0c1d4a]">
                <Filter size={16} /> Filters
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-[#dc2626] hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            {allAirlines.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
                  Airline
                </p>
                <div className="space-y-1">
                  {allAirlines.map((airline) => (
                    <label
                      key={airline}
                      className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-[#dc2626]"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAirlines.includes(airline)}
                        onChange={() => toggleAirline(airline)}
                        className="rounded border-gray-300 text-[#dc2626] focus:ring-[#dc2626]"
                      />
                      <Plane size={14} /> {airline}
                    </label>
                  ))}
                </div>
              </div>
            )}

          </div>
        </aside>

        <div className="flex-1">
          {filteredGroups.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center text-gray-500">
              No Umrah groups match your filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredGroups.map((g) => {
                const img =
                  fallbackImages[g.airline || "Saudia"] || fallbackImages["Saudia"];
                return (
                  <div
                    key={g.id}
                    className="bg-white rounded-lg shadow-md border overflow-hidden flex flex-col"
                  >
                    <div className="relative h-44 shrink-0">
                      <img
                        src={img}
                        alt={g.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#0c1d4a] px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm flex items-center gap-1">
                        <Plane size={12} /> {g.airline || "N/A"}
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="text-base font-bold text-[#0c1d4a] mb-2">
                        {g.title}
                      </h3>

                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="bg-gray-50 rounded-md p-2 text-center">
                          <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                            Departure
                          </p>
                          <p className="text-xs font-semibold text-[#0c1d4a]">
                            {g.departure_date}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-md p-2 text-center">
                          <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                            Return
                          </p>
                          <p className="text-xs font-semibold text-[#0c1d4a]">
                            {g.return_date || "N/A"}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-md p-2 text-center">
                          <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                            Days
                          </p>
                          <p className="text-xs font-semibold text-[#0c1d4a]">
                            {g.days || "-"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                        <Users size={14} className="text-[#dc2626]" />
                        <span>{g.available_seats} / {g.seats} seats available</span>
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div>
                          <p className="text-[10px] text-gray-500">Price / pax</p>
                          <p className="text-lg font-bold text-[#dc2626]">
                            PKR {g.price.toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => openBookModal(g)}
                          disabled={g.available_seats <= 0}
                          className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 disabled:opacity-50"
                        >
                          {g.available_seats <= 0 ? "Sold Out" : "Book Now"} <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-8 bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-bold">My Umrah Bookings</h2>
            </div>
            <div className="p-6">
              {bookings.length === 0 ? (
                <p className="text-gray-500">No Umrah bookings found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3">Ref#</th>
                        <th className="text-left py-2 px-3">Group</th>
                        <th className="text-left py-2 px-3">Adults</th>
                        <th className="text-left py-2 px-3">Infants</th>
                        <th className="text-left py-2 px-3">Amount</th>
                        <th className="text-left py-2 px-3">Status</th>
                        <th className="text-left py-2 px-3">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b) => (
                        <tr key={b.id} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-3 font-medium">{b.reference_id}</td>
                          <td className="py-2 px-3">
                            {groups.find((g) => g.id === b.group_id)?.title || "N/A"}
                          </td>
                          <td className="py-2 px-3">{b.adults}</td>
                          <td className="py-2 px-3">{b.infants}</td>
                          <td className="py-2 px-3">
                            PKR {b.total_amount?.toLocaleString()}
                          </td>
                          <td className="py-2 px-3">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
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
                          <td className="py-2 px-3">
                            {b.created_at?.split("T")[0]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={!!selectedGroup} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book Umrah Group</DialogTitle>
          </DialogHeader>

          {selectedGroup && (
            <form onSubmit={handleBooking} className="space-y-4">
              <div className="bg-gray-50 rounded-md p-3 text-sm">
                <p className="font-semibold text-[#0c1d4a]">{selectedGroup.title}</p>
                <p className="text-gray-500 text-xs mt-1">
                  {selectedGroup.airline || "N/A"} · {selectedGroup.days} Days · {selectedGroup.departure_date}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adults
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={selectedGroup.available_seats}
                    value={adults}
                    onChange={(e) => setAdults(Math.max(1, Math.min(selectedGroup.available_seats, Number(e.target.value))))}
                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Infants
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={infants}
                    onChange={(e) => setInfants(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between bg-[#dc2626]/10 rounded-md p-3">
                <span className="text-sm font-medium text-[#0c1d4a]">Total Amount</span>
                <span className="text-lg font-bold text-[#dc2626]">
                  PKR {(selectedGroup.price * adults).toLocaleString()}
                </span>
              </div>

              {bookingError && (
                <p className="text-sm text-red-600">{bookingError}</p>
              )}

              {bookingSuccess && (
                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-md p-2">
                  <CheckCircle2 size={16} /> Booking confirmed successfully!
                </div>
              )}

              <DialogFooter>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border rounded-md text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading || bookingSuccess}
                  className="px-4 py-2 bg-[#dc2626] text-white rounded-md text-sm hover:bg-[#b91c1c] transition-colors disabled:opacity-50"
                >
                  {bookingLoading ? "Booking..." : "Confirm Booking"}
                </button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
