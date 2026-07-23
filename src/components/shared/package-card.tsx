"use client";

import {
  Plane,
  Calendar,
  Armchair,
  Utensils,
  Moon,
  MapPin,
  ArrowRight,
  Pencil,
  Trash2,
  CircleDot,
  Users,
} from "lucide-react";
import { UmrahPackage, Hotel } from "@/lib/package-types";
import {
  getPackageImage,
  formatPrice,
  formatPackageDate,
  getAirportCode,
  getNightsSplit,
  getRoomPrice,
  getDistanceLabel,
  findHotelImageByName,
  findHotelDistanceByName,
} from "@/lib/package-helpers";

interface PackageCardProps {
  pkg: UmrahPackage;
  variant?: "default" | "featured" | "compact" | "admin";
  hotels?: Hotel[];
  onBook?: (pkg: UmrahPackage) => void;
  onEdit?: (pkg: UmrahPackage) => void;
  onDelete?: (pkg: UmrahPackage) => void;
  className?: string;
}

const roomTypes = [
  { key: "sharing", label: "SHARED", image: "/shared.jpeg" },
  { key: "double", label: "DOUBLE", image: "/double.jpeg" },
  { key: "triple", label: "TRIPLE", image: "/trple.jpeg" },
  { key: "quad", label: "QUAD", image: "/quard.jpeg" },
];

export default function PackageCard({
  pkg,
  variant = "default",
  hotels = [],
  onBook,
  onEdit,
  onDelete,
  className = "",
}: PackageCardProps) {
  const image = getPackageImage(pkg);
  const fromCode = getAirportCode(pkg.from_city);
  const toCode = getAirportCode(pkg.to_city);
  const makkahNights = pkg.makkah_nights ?? getNightsSplit(pkg.days).makkah;
  const madinaNights = pkg.madina_nights ?? getNightsSplit(pkg.days).madina;
  const featured = variant === "featured";
  const makkahImage = findHotelImageByName(hotels, pkg.hotel_makkah, "makkah");
  const madinaImage = findHotelImageByName(hotels, pkg.hotel_madina, "madina");
  const makkahDistance = findHotelDistanceByName(hotels, pkg.hotel_makkah, pkg.makkah_hotel_distance || "Near Haram");
  const madinaDistance = findHotelDistanceByName(hotels, pkg.hotel_madina, pkg.madina_hotel_distance || "Near Haram");

  return (
    <div
      className={`bg-white rounded-xl shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] border overflow-hidden flex flex-col transition-shadow ${className}`}
    >
      {/* Airline header */}
      <div className="relative h-44 shrink-0">
        <img src={image} alt={pkg.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute top-3 left-3 bg-white/95 text-[#0c1d4a] px-3 py-1.5 rounded-md text-xs font-bold shadow-sm flex items-center gap-2">
          <Plane size={14} className="text-amber-500" />
          {pkg.airline}
        </div>
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className={`font-bold leading-tight ${featured ? "text-lg" : "text-base"}`}>{pkg.title}</h3>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        {/* Departure / Return strip */}
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 mb-3">
          <div className="text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-wide">Departure</p>
            <p className="text-xs font-bold text-[#0c1d4a]">{formatPackageDate(pkg.departure_date)}</p>
          </div>
          <div className="flex flex-col items-center">
            <Plane size={16} className="text-amber-500" />
            <span className="text-[10px] bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full font-bold mt-1">
              {pkg.days} days
            </span>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-wide">Return</p>
            <p className="text-xs font-bold text-[#0c1d4a]">{formatPackageDate(pkg.return_date)}</p>
          </div>
        </div>

        {/* Flight segments */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between text-xs bg-white border rounded-lg p-2.5">
            <div className="flex items-center gap-2 font-bold text-[#0c1d4a]">
              <span>{fromCode}</span>
              <Plane size={12} className="text-amber-500" />
              <span>{toCode}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar size={10} /> {pkg.departure_date?.split("T")[0]}
              </span>
              <span className="flex items-center gap-1 text-green-600">
                <Utensils size={10} /> Meals
              </span>
            </div>
          </div>
          {pkg.return_date && (
            <div className="flex items-center justify-between text-xs bg-white border rounded-lg p-2.5">
              <div className="flex items-center gap-2 font-bold text-[#0c1d4a]">
                <span>{toCode}</span>
                <Plane size={12} className="text-amber-500" />
                <span>{fromCode}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar size={10} /> {pkg.return_date.split("T")[0]}
                </span>
                <span className="flex items-center gap-1 text-green-600">
                  <Utensils size={10} /> Meals
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Seats row */}
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2.5 mb-3">
          <Armchair size={14} className="text-[#0c1d4a] shrink-0" />
          <span className="text-xs font-bold text-[#0c1d4a] tracking-wide">
            {pkg.seats ?? "-"} Seats Available
          </span>
        </div>

        {/* Hotel rows */}
        <div className="space-y-2 mb-3">
          {pkg.hotel_makkah && (
            <div className="flex items-center justify-between bg-white border rounded-lg p-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                  {makkahImage ? (
                    <img src={makkahImage} alt={pkg.hotel_makkah} className="w-full h-full object-cover" />
                  ) : (
                    <CircleDot size={16} className="text-[#dc2626]" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#0c1d4a] truncate">{pkg.hotel_makkah}</p>
                  <p className="text-[10px] text-gray-500 flex items-center gap-1">
                    <MapPin size={10} /> {getDistanceLabel(makkahDistance, "Near Haram")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-[#0c1d4a] font-bold shrink-0">
                <Moon size={10} /> {makkahNights} Nights
              </div>
            </div>
          )}
          {pkg.hotel_madina && (
            <div className="flex items-center justify-between bg-white border rounded-lg p-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                  {madinaImage ? (
                    <img src={madinaImage} alt={pkg.hotel_madina} className="w-full h-full object-cover" />
                  ) : (
                    <CircleDot size={16} className="text-emerald-600" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#0c1d4a] truncate">{pkg.hotel_madina}</p>
                  <p className="text-[10px] text-gray-500 flex items-center gap-1">
                    <MapPin size={10} /> {getDistanceLabel(madinaDistance, "Near Haram")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-[#0c1d4a] font-bold shrink-0">
                <Moon size={10} /> {madinaNights} Nights
              </div>
            </div>
          )}
          {pkg.hotel_makkah && (
            <div className="flex items-center justify-between bg-white border rounded-lg p-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                  {makkahImage ? (
                    <img src={makkahImage} alt={pkg.hotel_makkah} className="w-full h-full object-cover" />
                  ) : (
                    <CircleDot size={16} className="text-[#dc2626]" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#0c1d4a] truncate">{pkg.hotel_makkah}</p>
                  <p className="text-[10px] text-gray-500 flex items-center gap-1">
                    <MapPin size={10} /> {getDistanceLabel(makkahDistance, "Near Haram")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-[#0c1d4a] font-bold shrink-0">
                <Moon size={10} /> {makkahNights} Nights
              </div>
            </div>
          )}
        </div>

        {/* Room price cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {roomTypes.map((rt) => {
            const price = getRoomPrice(pkg, rt.key);
            return (
              <div key={rt.key} className="bg-gray-50 rounded-lg p-2 text-center border">
                <img
                  src={rt.image}
                  alt={rt.label}
                  className="w-8 h-8 rounded-full object-cover mx-auto mb-1 border"
                />
                <p className="text-[10px] font-bold text-[#0c1d4a] mb-1">{rt.label}</p>
                <p className="text-xs font-bold text-[#dc2626]">PKR {formatPrice(price)}</p>
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <p className="text-[10px] text-gray-500">Starting from</p>
            <p className="text-lg font-bold text-[#dc2626]">PKR {formatPrice(pkg.price)}</p>
          </div>
          <div className="flex items-center gap-2">
            {onBook && (
              <button
                onClick={() => onBook(pkg)}
                className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1"
              >
                Book Now <ArrowRight size={14} />
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(pkg)}
                className="text-blue-500 hover:text-blue-700 p-1.5"
                title="Edit"
              >
                <Pencil size={16} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(pkg)}
                className="text-red-500 hover:text-red-700 p-1.5"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
