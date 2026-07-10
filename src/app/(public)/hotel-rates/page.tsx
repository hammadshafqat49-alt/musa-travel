import { getHotelRates } from "@/lib/data";
import HotelRateList from "./hotel-rate-list";

export default async function HotelRatesPage() {
  const rates = getHotelRates() as any[];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-14 max-w-2xl mx-auto">
        <span className="text-[#dc2626] font-semibold text-sm uppercase tracking-wider">
          Premium Accommodations
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-[#0c1d4a] mt-2 mb-4">
          Hotel Rates
        </h1>
        <p className="text-gray-600">
          Hand-picked hotels within walking distance of Haram in Makkah and
          Madinah. Compare room rates and book the perfect stay for your Umrah.
        </p>
      </div>

      <HotelRateList rates={rates} />
    </div>
  );
}
