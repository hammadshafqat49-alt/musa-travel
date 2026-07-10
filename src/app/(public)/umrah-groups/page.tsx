"use client";

import { useState, useEffect } from "react";
import {
  Plane,
  ArrowRight,
  X,
  CheckCircle2,
  Phone,
  Mail,
  User,
  Users,
  CalendarDays,
} from "lucide-react";

const groupImages: Record<string, string> = {
  default:
    "https://images.unsplash.com/photo-1565058688641-6776481d1b84?w=800&auto=format&fit=crop&q=80",
  Saudia:
    "https://images.unsplash.com/photo-1542317805-56f3415e0e94?w=800&auto=format&fit=crop&q=80",
  PIA:
    "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&auto=format&fit=crop&q=80",
  Airblue:
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop&q=80",
  SereneAir:
    "https://images.unsplash.com/photo-1527612820672-5b56351f7346?w=800&auto=format&fit=crop&q=80",
};

interface UmrahGroup {
  id: number;
  title: string;
  departure_date: string;
  return_date: string;
  airline: string;
  price: number;
  days: number;
  seats: number;
  available_seats: number;
}

function GroupCard({
  group,
  onBook,
}: {
  group: UmrahGroup;
  onBook: (g: UmrahGroup) => void;
}) {
  const img = groupImages[group.airline] || groupImages["default"];
  return (
    <div className="bg-white rounded-xl shadow-md border overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative h-48">
        <img src={img} alt={group.title} className="w-full h-full object-cover" />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#0c1d4a] px-2.5 py-1 rounded-md text-xs font-bold shadow-sm flex items-center gap-1">
          <Plane size={12} /> {group.airline}
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-[#0c1d4a] mb-2">{group.title}</h3>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-gray-50 rounded-md p-2 text-center">
            <p className="text-[10px] text-gray-500 uppercase">Departure</p>
            <p className="text-xs font-semibold text-[#0c1d4a]">{group.departure_date}</p>
          </div>
          <div className="bg-gray-50 rounded-md p-2 text-center">
            <p className="text-[10px] text-gray-500 uppercase">Return</p>
            <p className="text-xs font-semibold text-[#0c1d4a]">{group.return_date || "N/A"}</p>
          </div>
        </div>

        <div className="space-y-1.5 mb-3 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Duration</span>
            <span className="font-medium text-[#0c1d4a]">{group.days} Days</span>
          </div>
          <div className="flex justify-between">
            <span>Seats Available</span>
            <span className="font-medium text-[#0c1d4a]">
              {group.available_seats}/{group.seats}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <p className="text-[10px] text-gray-500">Per Person</p>
            <p className="text-lg font-bold text-[#dc2626]">
              PKR {group.price.toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => onBook(group)}
            className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-5 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1"
          >
            Book Now <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function BookingModal({
  group,
  onClose,
}: {
  group: UmrahGroup;
  onClose: () => void;
}) {
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [adults, setAdults] = useState(1);
  const [infants, setInfants] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const total = group.price * adults;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "umrah",
          group_id: group.id,
          adults,
          infants,
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
          <h2 className="text-lg font-bold text-[#0c1d4a]">Book Umrah Group</h2>
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
              <p className="font-semibold text-[#0c1d4a]">{group.title}</p>
              <p className="text-gray-500 text-xs mt-1">
                {group.airline} · {group.days} Days · {group.departure_date}
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

            <div className="grid grid-cols-2 gap-4">
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

export default function UmrahGroupsPage() {
  const [groups, setGroups] = useState<UmrahGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<UmrahGroup | null>(null);

  useEffect(() => {
    async function fetchGroups() {
      try {
        const res = await fetch("/api/public/groups");
        const data = await res.json();
        setGroups(data.groups || []);
      } finally {
        setLoading(false);
      }
    }
    fetchGroups();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-500">
        Loading groups...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-[#0c1d4a] mb-4">Umrah Groups</h1>
        <p className="text-gray-600">
          Join our organized Umrah groups with experienced guides and premium services.
        </p>
      </div>

      {selectedGroup && (
        <BookingModal group={selectedGroup} onClose={() => setSelectedGroup(null)} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((g) => (
          <GroupCard key={g.id} group={g} onBook={setSelectedGroup} />
        ))}
      </div>

      {groups.length === 0 && (
        <div className="text-center py-12 text-gray-500">No groups available.</div>
      )}
    </div>
  );
}
