import { getHotelRates } from "@/lib/data";
import HotelRateList from "@/app/(public)/hotel-rates/hotel-rate-list";

export default async function AgentHotelsPage() {
  const rates = await getHotelRates() as any[];

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-[#0c1d4a]">Hotels</h1>
        <p className="text-sm text-gray-500 mt-1">
          Browse all hotels added by admin with their room rates.
        </p>
      </div>

      <HotelRateList rates={rates} showPriceFilter={false} />
    </div>
  );
}
