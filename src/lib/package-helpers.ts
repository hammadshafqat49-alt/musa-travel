import { UmrahPackage, Hotel } from "./package-types";

export const fallbackImages: Record<string, string> = {
  Saudia: "https://images.unsplash.com/photo-1565058688641-6776481d1b84?w=800&auto=format&fit=crop&q=80",
  PIA: "https://images.unsplash.com/photo-1548685913-fe6678babe8d?w=800&auto=format&fit=crop&q=80",
  Airblue: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&auto=format&fit=crop&q=80",
  SereneAir: "https://images.unsplash.com/photo-1527612820672-5b56351f7346?w=800&auto=format&fit=crop&q=80",
};

export const hotelFallbackImages = {
  makkah: "/makkah.jpeg",
  madina: "/madina.jpeg",
};

export function getPackageImage(pkg: UmrahPackage): string {
  return pkg.image_url || fallbackImages[pkg.airline] || fallbackImages["Saudia"];
}

export function formatPrice(n?: number | null): string {
  if (!n || Number.isNaN(n)) return "0";
  return n.toLocaleString("en-PK");
}

export function formatPackageDate(date?: string | null): string {
  if (!date) return "-";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function getAirportCode(city?: string | null): string {
  if (!city) return "-";
  const normalized = city.trim().toLowerCase();
  if (normalized.includes("jeddah") || normalized.includes("jiddah") || normalized === "jed") return "JED";
  if (normalized.includes("makkah") || normalized.includes("mecca") || normalized === "mak") return "MAK";
  if (normalized.includes("madina") || normalized.includes("medina") || normalized === "mad") return "MAD";
  if (normalized.includes("lahore") || normalized === "lyp") return "LYP";
  if (normalized.includes("karachi") || normalized === "khi") return "KHI";
  if (normalized.includes("islamabad") || normalized === "isb") return "ISB";
  if (normalized.includes("dubai") || normalized === "dxb") return "DXB";
  if (normalized.includes("multan") || normalized === "mux") return "MUX";
  if (normalized.includes("faisalabad") || normalized === "lyp") return "LYP";
  return city.slice(0, 3).toUpperCase();
}

export function getRouteSummary(pkg: UmrahPackage): string {
  const from = getAirportCode(pkg.from_city || pkg.to_city);
  const to = getAirportCode(pkg.to_city || pkg.from_city);
  if (!from || !to || from === to) return `${from}-${to}`;
  return `${from}-${to}-${from}`;
}

export function getNightsSplit(days?: number): { makkah: number; madina: number } {
  const total = Math.max((days || 0) - 1, 0);
  const makkah = Math.ceil(total * 0.6);
  const madina = total - makkah;
  return { makkah, madina };
}

export function getRoomPrice(pkg: UmrahPackage, roomType: string): number {
  if (roomType === "sharing") return pkg.sharing_price || pkg.price || 0;
  if (roomType === "double") return pkg.double_price || pkg.price || 0;
  if (roomType === "triple") return pkg.triple_price || pkg.price || 0;
  if (roomType === "quad") return pkg.quad_price || pkg.price || 0;
  return pkg.price || 0;
}

export function getExplicitRoomPrice(pkg: UmrahPackage, roomType: string): number | null {
  if (roomType === "sharing") return pkg.sharing_price || null;
  if (roomType === "double") return pkg.double_price || null;
  if (roomType === "triple") return pkg.triple_price || null;
  if (roomType === "quad") return pkg.quad_price || null;
  return pkg.price || null;
}

export function getDistanceLabel(distance?: string | null, fallback = "Walking distance"): string {
  if (!distance) return fallback;
  return distance;
}

export function findHotelImageByName(
  hotels: Hotel[],
  name?: string | null,
  fallbackType?: "makkah" | "madina"
): string | undefined {
  if (!name) return fallbackType ? hotelFallbackImages[fallbackType] : undefined;
  const normalized = name.trim().toLowerCase();
  const hotel = hotels.find((h) => h.name.trim().toLowerCase() === normalized);
  if (hotel?.image_url) return hotel.image_url;
  if (normalized.includes("makkah") || normalized.includes("mecca")) return hotelFallbackImages.makkah;
  if (normalized.includes("madina") || normalized.includes("medina")) return hotelFallbackImages.madina;
  return fallbackType ? hotelFallbackImages[fallbackType] : undefined;
}

export function findHotelDistanceByName(
  hotels: Hotel[],
  name?: string | null,
  fallback?: string
): string | undefined {
  if (!name) return fallback;
  const normalized = name.trim().toLowerCase();
  const hotel = hotels.find((h) => h.name.trim().toLowerCase() === normalized);
  return hotel?.distance || fallback;
}
