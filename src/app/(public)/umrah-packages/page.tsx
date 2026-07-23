"use client";

import { useState, useEffect } from "react";
import {
  X,
  CheckCircle2,
  Phone,
  Mail,
  User,
  Users,
  BedDouble,
} from "lucide-react";
import PackageCard from "@/components/shared/package-card";
import { UmrahPackage, Hotel } from "@/lib/package-types";

function BookingModal({ pkg, onClose }: { pkg: UmrahPackage; onClose: () => void }) {
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [roomType, setRoomType] = useState("sharing");
  const [transportIncluded, setTransportIncluded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const getUnitPrice = (rt: string) => {
    if (rt === "sharing") return pkg.sharing_price || pkg.price;
    if (rt === "double") return pkg.double_price || pkg.price;
    if (rt === "triple") return pkg.triple_price || pkg.price;
    if (rt === "quad") return pkg.quad_price || pkg.price;
    return pkg.price;
  };

  const total = getUnitPrice(roomType) * (adults + children);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "package",
          package_id: pkg.id,
          adults,
          children,
          infants,
          room_type: roomType,
          transport_included: transportIncluded,
          client_name: clientName,
          client_phone: clientPhone,
          client_email: clientEmail,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-bold text-[#0c1d4a]">Book Package</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-[#0c1d4a] mb-2">Booking Request Sent!</h3>
            <p className="text-gray-600 mb-4">
              Thank you {clientName}. Our team will contact you within 24 hours to confirm your booking.
            </p>
            <button
              onClick={onClose}
              className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-6 py-2 rounded-md font-medium transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="bg-gray-50 rounded-lg p-3 text-sm">
              <p className="font-semibold text-[#0c1d4a]">{pkg.title}</p>
              <p className="text-gray-500 text-xs mt-1">
                {pkg.airline} · {pkg.days} Days · {pkg.departure_date} · {pkg.from_city} → {pkg.to_city}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User size={14} className="inline mr-1" /> Full Name *
              </label>
              <input
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Your full name"
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone size={14} className="inline mr-1" /> Phone *
                </label>
                <input
                  required
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="03XX-XXXXXXX"
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail size={14} className="inline mr-1" /> Email
                </label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <BedDouble size={14} className="inline mr-1" /> Room Type
              </label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626]"
              >
                <option value="sharing">
                  Sharing — PKR {getUnitPrice("sharing").toLocaleString()} / person
                </option>
                <option value="double">
                  Double — PKR {getUnitPrice("double").toLocaleString()} / person
                </option>
                <option value="triple">
                  Triple — PKR {getUnitPrice("triple").toLocaleString()} / person
                </option>
                <option value="quad">
                  Quad — PKR {getUnitPrice("quad").toLocaleString()} / person
                </option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Users size={14} className="inline mr-1" /> Adults
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Children</label>
                <input
                  type="number"
                  min={0}
                  value={children}
                  onChange={(e) => setChildren(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Infants</label>
                <input
                  type="number"
                  min={0}
                  value={infants}
                  onChange={(e) => setInfants(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="transport"
                type="checkbox"
                checked={transportIncluded}
                onChange={(e) => setTransportIncluded(e.target.checked)}
                className="w-4 h-4 text-[#dc2626] border-gray-300 rounded focus:ring-[#dc2626]"
              />
              <label htmlFor="transport" className="text-sm font-medium text-gray-700">Transport Included</label>
            </div>

            <div className="flex items-center justify-between bg-[#dc2626]/10 rounded-md p-3">
              <span className="text-sm font-medium text-[#0c1d4a]">Estimated Total</span>
              <span className="text-lg font-bold text-[#dc2626]">PKR {total.toLocaleString()}</span>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border rounded-md text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2.5 bg-[#dc2626] text-white rounded-md text-sm font-medium hover:bg-[#b91c1c] transition-colors disabled:opacity-50"
              >
                {loading ? "Processing..." : "Confirm Booking"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function UmrahPackagesPage() {
  const [packages, setPackages] = useState<UmrahPackage[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPkg, setSelectedPkg] = useState<UmrahPackage | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [packagesRes, hotelsRes] = await Promise.all([
          fetch("/api/public/packages"),
          fetch("/api/public/hotels"),
        ]);
        const packagesData = await packagesRes.json();
        const hotelsData = await hotelsRes.json();
        setPackages(packagesData.packages || []);
        setHotels(hotelsData.hotels || []);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-500">
        Loading packages...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-[#0c1d4a] mb-4">Umrah Packages</h1>
        <p className="text-gray-600">
          Choose from our wide range of Umrah packages with premium hotels and airlines.
        </p>
      </div>

      {selectedPkg && (
        <BookingModal pkg={selectedPkg} onClose={() => setSelectedPkg(null)} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} hotels={hotels} onBook={() => setSelectedPkg(pkg)} />
        ))}
      </div>

      {packages.length === 0 && (
        <div className="text-center py-12 text-gray-500">No packages available.</div>
      )}
    </div>
  );
}
