"use client";

import { useState, useMemo } from "react";
import {
  MapPin,
  Star,
  BedDouble,
  Calendar,
  Building2,
  ArrowRight,
  Filter,
  X,
} from "lucide-react";

interface HotelRate {
  id: number;
  hotel_name: string;
  city: string;
  rating: number;
  address: string;
  distance: string;
  date_from: string;
  date_to: string;
  sharing_price: number;
  double_price: number;
  triple_price: number;
  quad_price: number;
}

const fallbackImages: Record<string, string> = {
  Makkah:
    "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&auto=format&fit=crop",
  Madina:
    "https://images.pexels.com/photos/35093952/pexels-photo-35093952.jpeg?auto=compress&cs=tinysrgb&w=800",
};

function formatPrice(val: number | null) {
  if (!val || val <= 0) return "-";
  return `PKR ${val.toLocaleString()}`;
}

export default function HotelRateList({ rates, showPriceFilter = true }: { rates: HotelRate[]; showPriceFilter?: boolean }) {
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedRate, setSelectedRate] = useState<HotelRate | null>(null);
  const [showInquiry, setShowInquiry] = useState(false);

  const allCities = useMemo(
    () => Array.from(new Set(rates.map((r) => r.city).filter(Boolean))),
    [rates]
  );

  const filteredRates = useMemo(() => {
    return rates.filter((r) => {
      if (selectedCity !== "all" && r.city !== selectedCity) return false;
      const min = minPrice ? Number(minPrice) : 0;
      const max = maxPrice ? Number(maxPrice) : Infinity;
      const prices = [
        r.sharing_price,
        r.double_price,
        r.triple_price,
        r.quad_price,
      ].filter((p) => p && p > 0) as number[];
      const lowest = prices.length > 0 ? Math.min(...prices) : 0;
      if (lowest < min || lowest > max) return false;
      return true;
    });
  }, [rates, selectedCity, minPrice, maxPrice]);

  const makkahCount = rates.filter((r) => r.city === "Makkah").length;
  const madinaCount = rates.filter((r) => r.city === "Madina").length;

  const clearFilters = () => {
    setSelectedCity("all");
    setMinPrice("");
    setMaxPrice("");
  };

  const hasActiveFilters =
    selectedCity !== "all" || minPrice || maxPrice;

  return (
    <>
      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-[#1e3a8a] text-white rounded-xl p-5 text-center">
          <p className="text-3xl font-bold">{rates.length}</p>
          <p className="text-sm text-gray-300">Total Hotels</p>
        </div>
        <div className="bg-white border rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-[#0c1d4a]">{makkahCount}</p>
          <p className="text-sm text-gray-500">Makkah Hotels</p>
        </div>
        <div className="bg-white border rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-[#0c1d4a]">{madinaCount}</p>
          <p className="text-sm text-gray-500">Madina Hotels</p>
        </div>
        <div className="bg-[#dc2626] text-white rounded-xl p-5 text-center">
          <p className="text-3xl font-bold">4</p>
          <p className="text-sm text-white/80">Room Types</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
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

            <div className="mb-4">
              <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
                City
              </p>
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-[#dc2626]">
                  <input
                    type="radio"
                    name="city"
                    checked={selectedCity === "all"}
                    onChange={() => setSelectedCity("all")}
                    className="rounded border-gray-300 text-[#dc2626] focus:ring-[#dc2626]"
                  />
                  All Cities
                </label>
                {allCities.map((city) => (
                  <label
                    key={city}
                    className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-[#dc2626]"
                  >
                    <input
                      type="radio"
                      name="city"
                      checked={selectedCity === city}
                      onChange={() => setSelectedCity(city)}
                      className="rounded border-gray-300 text-[#dc2626] focus:ring-[#dc2626]"
                    />
                    <MapPin size={14} /> {city}
                  </label>
                ))}
              </div>
            </div>

            {showPriceFilter && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
                Lowest Price (PKR)
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
            )}
          </div>
        </aside>

        {/* Cards Grid */}
        <div className="flex-1">
          {filteredRates.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center text-gray-500">
              No hotels match your filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredRates.map((r) => {
                const img =
                  fallbackImages[r.city] || fallbackImages["Makkah"];
                const prices = [
                  { key: "sharing", label: "Sharing", val: r.sharing_price },
                  { key: "double", label: "Double", val: r.double_price },
                  { key: "triple", label: "Triple", val: r.triple_price },
                  { key: "quad", label: "Quad", val: r.quad_price },
                ];
                const lowestPrice = prices
                  .filter((p) => p.val && p.val > 0)
                  .map((p) => p.val);
                const min =
                  lowestPrice.length > 0 ? Math.min(...lowestPrice) : 0;

                return (
                  <div
                    key={r.id}
                    className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="relative h-48 shrink-0">
                      <img
                        src={img}
                        alt={r.hotel_name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#0c1d4a] px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm flex items-center gap-1">
                        <MapPin size={12} className="text-[#dc2626]" /> {r.city}
                      </div>
                      {r.rating && (
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#0c1d4a] px-2 py-1 rounded-md text-xs font-semibold shadow-sm flex items-center gap-1">
                          <Star
                            size={12}
                            className="fill-[#dc2626] text-[#dc2626]"
                          />{" "}
                          {r.rating}
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h3 className="text-lg font-bold truncate">
                          {r.hotel_name}
                        </h3>
                        <p className="text-xs text-gray-200 truncate">
                          {r.address}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                        <Building2 size={14} className="text-[#dc2626]" />
                        <span>Distance: {r.distance || "N/A"}</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                        <Calendar size={14} className="text-[#dc2626]" />
                        <span>
                          {r.date_from}{" "}
                          <span className="text-gray-400">to</span>{" "}
                          {r.date_to}
                        </span>
                      </div>

                      <div className="border rounded-lg overflow-hidden mb-3">
                        <div className="bg-gray-50 px-3 py-1.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide border-b">
                          Price Per Night (PKR)
                        </div>
                        <div className="grid grid-cols-4 text-center divide-x">
                          {prices.map((p) => (
                            <div key={p.key} className="py-2">
                              <p className="text-[10px] text-gray-500">
                                {p.label}
                              </p>
                              <p className="text-xs font-bold text-[#0c1d4a]">
                                {formatPrice(p.val)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div>
                          <p className="text-[10px] text-gray-500">Starting from</p>
                          <p className="text-xl font-bold text-[#dc2626]">
                            {min > 0
                              ? `PKR ${min.toLocaleString()}`
                              : "N/A"}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedRate(r);
                            setShowInquiry(true);
                          }}
                          className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1"
                        >
                          Inquiry <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Inquiry Modal */}
      {showInquiry && selectedRate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowInquiry(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-bold text-[#0c1d4a] mb-1">
              Hotel Inquiry
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              {selectedRate.hotel_name} — {selectedRate.city}
            </p>

            <form
              action="/api/contact"
              method="POST"
              className="space-y-3"
              onSubmit={() => setTimeout(() => setShowInquiry(false), 500)}
            >
              <input
                type="hidden"
                name="subject"
                value={`Hotel Inquiry: ${selectedRate.hotel_name}`}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-[#dc2626] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-[#dc2626] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  name="phone"
                  type="tel"
                  required
                  className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-[#dc2626] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={3}
                  defaultValue={`Interested in ${selectedRate.hotel_name} (${selectedRate.city}). Dates: ${selectedRate.date_from} to ${selectedRate.date_to}. Please share availability and best rates.`}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-[#dc2626] outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInquiry(false)}
                  className="px-4 py-2 border rounded-md text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#dc2626] text-white rounded-md text-sm hover:bg-[#b91c1c]"
                >
                  Send Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
