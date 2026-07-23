"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plane,
  X,
  Filter,
  BedDouble,
  CheckCircle2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import PackageCard from "@/components/shared/package-card";
import { UmrahPackage, Hotel } from "@/lib/package-types";

interface Booking {
  id: number;
  reference_id: string;
  package_id: number;
  adults: number;
  infants: number;
  total_amount: number;
  status: string;
  room_type: string;
  created_at: string;
}

const roomLabels: Record<string, string> = {
  sharing: "Sharing",
  double: "Double",
  triple: "Triple",
  quad: "Quad",
};

export default function PackageBookingClient({
  packages,
  bookings: initialBookings,
}: {
  packages: UmrahPackage[];
  bookings: Booking[];
}) {
  const router = useRouter();
  const [bookings, setBookings] = useState(initialBookings);
  const [hotels, setHotels] = useState<Hotel[]>([]);

  useEffect(() => {
    async function fetchHotels() {
      try {
        const res = await fetch("/api/public/hotels");
        const data = await res.json();
        setHotels(data.hotels || []);
      } catch {}
    }
    fetchHotels();
  }, []);

  // Filters
  const allAirlines = useMemo(
    () =>
      Array.from(
        new Set(
          packages
            .map((p) => p.airline?.trim())
            .filter((a): a is string => Boolean(a) && a.length > 0)
        )
      ).sort(),
    [packages]
  );
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Modal
  const [selectedPkg, setSelectedPkg] = useState<UmrahPackage | null>(null);
  const [roomType, setRoomType] = useState("sharing");
  const [adults, setAdults] = useState(1);
  const [infants, setInfants] = useState(0);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const filteredPackages = useMemo(() => {
    return packages.filter((p) => {
      if (selectedAirlines.length > 0 && !selectedAirlines.includes(p.airline))
        return false;
      if (selectedDays && String(p.days || 0) !== selectedDays) return false;
      if (minPrice && p.price < Number(minPrice)) return false;
      if (maxPrice && p.price > Number(maxPrice)) return false;
      return true;
    });
  }, [packages, selectedAirlines, selectedDays, minPrice, maxPrice]);

  const toggleAirline = (airline: string) => {
    setSelectedAirlines((prev) =>
      prev.includes(airline)
        ? prev.filter((a) => a !== airline)
        : [...prev, airline]
    );
  };

  const openBookModal = (pkg: UmrahPackage) => {
    setSelectedPkg(pkg);
    setRoomType("sharing");
    setAdults(1);
    setInfants(0);
    setBookingError("");
    setBookingSuccess(false);
  };

  const closeModal = () => {
    setSelectedPkg(null);
    setBookingError("");
    setBookingSuccess(false);
  };

  const getUnitPrice = (pkg: UmrahPackage, rt: string) => {
    if (rt === "sharing") return pkg.sharing_price || pkg.price;
    if (rt === "double") return pkg.double_price || pkg.price;
    if (rt === "triple") return pkg.triple_price || pkg.price;
    if (rt === "quad") return pkg.quad_price || pkg.price;
    return pkg.price;
  };

  const previewTotal = selectedPkg
    ? getUnitPrice(selectedPkg, roomType) * adults
    : 0;

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPkg) return;
    setBookingLoading(true);
    setBookingError("");
    try {
      const formData = new FormData();
      formData.append("type", "package");
      formData.append("package_id", String(selectedPkg.id));
      formData.append("adults", String(adults));
      formData.append("infants", String(infants));
      formData.append("room_type", roomType);

      const res = await fetch("/api/agent/bookings", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Booking failed");
      }

      setBookingSuccess(true);
      // Refresh bookings by re-fetching
      const bookingsRes = await fetch("/api/agent/bookings?type=package");
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
    setSelectedDays("");
    setMinPrice("");
    setMaxPrice("");
  };

  const hasActiveFilters =
    selectedAirlines.length > 0 || selectedDays || minPrice || maxPrice;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0c1d4a]">Package Booking</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Sidebar */}
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

            {/* Airline Filter */}
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

            {/* Days Filter */}
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
                Days
              </p>
              <select
                value={selectedDays}
                onChange={(e) => setSelectedDays(e.target.value)}
                className="w-full px-2 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626]"
              >
                <option value="">All Days</option>
                <option value="15">15 Days</option>
                <option value="21">21 Days</option>
                <option value="28">28 Days</option>
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
                Price (PKR)
              </p>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-2 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626]"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-2 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626]"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Grid */}
        <div className="flex-1">
          {filteredPackages.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center text-gray-500">
              No packages match your filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredPackages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  hotels={hotels}
                  onBook={() => openBookModal(pkg)}
                />
              ))}
            </div>
          )}

          {/* My Package Bookings */}
          <div className="mt-8 bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-bold">My Package Bookings</h2>
            </div>
            <div className="p-6">
              {bookings.length === 0 ? (
                <p className="text-gray-500">No package bookings found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3">Ref#</th>
                        <th className="text-left py-2 px-3">Package</th>
                        <th className="text-left py-2 px-3">Adults</th>
                        <th className="text-left py-2 px-3">Infants</th>
                        <th className="text-left py-2 px-3">Room</th>
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
                            {packages.find((p) => p.id === b.package_id)?.title || "N/A"}
                          </td>
                          <td className="py-2 px-3">{b.adults}</td>
                          <td className="py-2 px-3">{b.infants}</td>
                          <td className="py-2 px-3 capitalize">
                            {b.room_type || "-"}
                          </td>
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

      {/* Booking Modal */}
      <Dialog open={!!selectedPkg} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book Package</DialogTitle>
          </DialogHeader>

          {selectedPkg && (
            <form onSubmit={handleBooking} className="space-y-4">
              <div className="bg-gray-50 rounded-md p-3 text-sm">
                <p className="font-semibold text-[#0c1d4a]">{selectedPkg.title}</p>
                <p className="text-gray-500 text-xs mt-1">
                  {selectedPkg.airline} · {selectedPkg.days} Days ·{" "}
                  {selectedPkg.departure_date}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Type
                </label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626]"
                >
                  <option value="sharing">
                    Sharing &mdash; PKR{" "}
                    {(
                      selectedPkg.sharing_price || selectedPkg.price
                    ).toLocaleString()}
                  </option>
                  <option value="double">
                    Double &mdash; PKR{" "}
                    {(
                      selectedPkg.double_price || selectedPkg.price
                    ).toLocaleString()}
                  </option>
                  <option value="triple">
                    Triple &mdash; PKR{" "}
                    {(
                      selectedPkg.triple_price || selectedPkg.price
                    ).toLocaleString()}
                  </option>
                  <option value="quad">
                    Quad &mdash; PKR{" "}
                    {(
                      selectedPkg.quad_price || selectedPkg.price
                    ).toLocaleString()}
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adults
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
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
                  PKR {previewTotal.toLocaleString()}
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
