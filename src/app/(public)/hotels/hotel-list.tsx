"use client";

import { useState, useMemo } from "react";
import {
  MapPin,
  Star,
  Building2,
  BedDouble,
  Phone,
  Filter,
  X,
} from "lucide-react";
import { Hotel } from "@/lib/package-types";
import { hotelFallbackImages } from "@/lib/package-helpers";

interface HotelListProps {
  hotels: Hotel[];
  showPriceFilter?: boolean;
}

export default function HotelList({ hotels, showPriceFilter = true }: HotelListProps) {
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [showInquiry, setShowInquiry] = useState(false);

  const allCities = useMemo(
    () => Array.from(new Set(hotels.map((h) => h.city).filter(Boolean))),
    [hotels]
  );

  const filteredHotels = useMemo(() => {
    return hotels.filter((h) => {
      if (selectedCity !== "all" && h.city !== selectedCity) return false;
      const prices = [
        h.sharing_price,
        h.double_price,
        h.triple_price,
        h.quad_price,
      ].filter((p): p is number => typeof p === "number" && p > 0);
      const lowest = prices.length > 0 ? Math.min(...prices) : 0;
      const min = minPrice ? Number(minPrice) : 0;
      const max = maxPrice ? Number(maxPrice) : Infinity;
      if (lowest > 0 && (lowest < min || lowest > max)) return false;
      return true;
    });
  }, [hotels, selectedCity, minPrice, maxPrice]);

  const makkahCount = hotels.filter((h) =>
    h.city?.toLowerCase().includes("makkah")
  ).length;
  const madinaCount = hotels.filter((h) =>
    h.city?.toLowerCase().includes("madina")
  ).length;

  const clearFilters = () => {
    setSelectedCity("all");
    setMinPrice("");
    setMaxPrice("");
  };

  const hasActiveFilters = selectedCity !== "all" || minPrice || maxPrice;

  const getImage = (h: Hotel) => {
    if (h.image_url) return h.image_url;
    const city = h.city?.toLowerCase() || "";
    if (city.includes("makkah")) return hotelFallbackImages.makkah;
    if (city.includes("madina")) return hotelFallbackImages.madina;
    return hotelFallbackImages.makkah;
  };

  return (
    <>
      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-[#1e3a8a] text-white rounded-xl p-5 text-center">
          <p className="text-3xl font-bold">{hotels.length}</p>
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
        <div className="bg-[#2563eb] text-white rounded-xl p-5 text-center">
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
                  className="text-xs text-[#2563eb] hover:underline"
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
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-[#2563eb]">
                  <input
                    type="radio"
                    name="city"
                    checked={selectedCity === "all"}
                    onChange={() => setSelectedCity("all")}
                    className="rounded border-gray-300 text-[#2563eb] focus:ring-[#2563eb]"
                  />
                  All Cities
                </label>
                {allCities.map((city) => (
                  <label
                    key={city}
                    className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-[#2563eb]"
                  >
                    <input
                      type="radio"
                      name="city"
                      checked={selectedCity === city}
                      onChange={() => setSelectedCity(city)}
                      className="rounded border-gray-300 text-[#2563eb] focus:ring-[#2563eb]"
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
                    className="w-full px-2 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-2 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                  />
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Cards Grid */}
        <div className="flex-1">
          {filteredHotels.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center text-gray-500">
              No hotels match your filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredHotels.map((h) => (
                  <div
                    key={h.id}
                    className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col hover:shadow-[0_8px_30px_rgba(37,99,235,0.18)] transition-shadow duration-300"
                  >
                    <div className="relative h-48 shrink-0">
                      <img
                        src={getImage(h)}
                        alt={h.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#0c1d4a] px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm flex items-center gap-1">
                        <MapPin size={12} className="text-[#2563eb]" /> {h.city}
                      </div>
                      {h.rating ? (
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#0c1d4a] px-2 py-1 rounded-md text-xs font-semibold shadow-sm flex items-center gap-1">
                          <Star
                            size={12}
                            className="fill-[#2563eb] text-[#2563eb]"
                          />{" "}
                          {h.rating}
                        </div>
                      ) : null}
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h3 className="text-lg font-bold truncate">
                          {h.name}
                        </h3>
                        <p className="text-xs text-gray-200 truncate">
                          {h.address}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                        <Building2 size={14} className="text-[#2563eb]" />
                        <span>Distance: {h.distance || "N/A"}</span>
                      </div>

                      <div className="mt-auto flex items-center justify-end pt-2">
                        <button
                          onClick={() => {
                            setSelectedHotel(h);
                            setShowInquiry(true);
                          }}
                          className="bg-[#2563eb] hover:bg-[#1e3a8a] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1"
                        >
                          <Phone size={14} /> Inquiry
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Inquiry Modal */}
      {showInquiry && selectedHotel && (
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
              {selectedHotel.name} — {selectedHotel.city}
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
                value={`Hotel Inquiry: ${selectedHotel.name}`}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-[#2563eb] outline-none"
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
                  className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-[#2563eb] outline-none"
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
                  className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-[#2563eb] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={3}
                  defaultValue={`Interested in ${selectedHotel.name} (${selectedHotel.city}). Please share availability and best rates.`}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-[#2563eb] outline-none"
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
                  className="px-4 py-2 bg-[#2563eb] text-white rounded-md text-sm hover:bg-[#1e3a8a]"
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
