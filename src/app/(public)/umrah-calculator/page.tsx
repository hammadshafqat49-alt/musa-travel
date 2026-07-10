"use client";

import { useState } from "react";
import { Calculator } from "lucide-react";

export default function UmrahCalculatorPage() {
  const [adults, setAdults] = useState(1);
  const [infants, setInfants] = useState(0);
  const [visaType, setVisaType] = useState("");
  const [adultVisaRate, setAdultVisaRate] = useState(18000);
  const [infantVisaRate, setInfantVisaRate] = useState(9000);
  const [roomType, setRoomType] = useState("Sharing");
  const [hotelMakkah, setHotelMakkah] = useState("VOCO");
  const [hotelMadina, setHotelMadina] = useState("Anwar Al Madinah");
  const [transport, setTransport] = useState("Private");

  const visaCost = (adults * adultVisaRate) + (infants * infantVisaRate);
  const hotelCost = adults * (roomType === "Sharing" ? 110 : roomType === "Double" ? 150 : roomType === "Triple" ? 130 : 120);
  const transportCost = transport === "Private" ? 15000 : 8000;
  const totalCost = visaCost + hotelCost + transportCost;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-[#0c1d4a] mb-2 flex items-center justify-center gap-2">
          <Calculator className="text-[#dc2626]" /> Umrah Calculator
        </h1>
        <p className="text-gray-600">Calculate estimated costs for your Umrah package.</p>
      </div>

      <div className="bg-white rounded-lg shadow-md border p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No. of Adults</label>
            <input type="number" min={1} value={adults} onChange={(e) => setAdults(Number(e.target.value))} className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No. of Infants</label>
            <input type="number" min={0} value={infants} onChange={(e) => setInfants(Number(e.target.value))} className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Visa Type</label>
            <select value={visaType} onChange={(e) => setVisaType(e.target.value)} className="w-full px-3 py-2 border rounded-md">
              <option value="">Select Visa Type</option>
              <option value="umrah">Umrah Visa</option>
              <option value="tourist">Tourist Visa</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adult Visa Rate</label>
            <input type="number" value={adultVisaRate} onChange={(e) => setAdultVisaRate(Number(e.target.value))} className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Infant Visa Rate</label>
            <input type="number" value={infantVisaRate} onChange={(e) => setInfantVisaRate(Number(e.target.value))} className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Visa Cost</label>
            <div className="px-3 py-2 border rounded-md bg-gray-50 font-medium">PKR {visaCost.toLocaleString()}</div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-bold mb-3">Hotel Selection</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
              <select value={roomType} onChange={(e) => setRoomType(e.target.value)} className="w-full px-3 py-2 border rounded-md">
                <option>Sharing</option>
                <option>Double</option>
                <option>Triple</option>
                <option>Quad</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Makkah Hotel</label>
              <select value={hotelMakkah} onChange={(e) => setHotelMakkah(e.target.value)} className="w-full px-3 py-2 border rounded-md">
                <option>VOCO</option>
                <option>Swissotel</option>
                <option>Hilton</option>
                <option>Conrad</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Madina Hotel</label>
              <select value={hotelMadina} onChange={(e) => setHotelMadina(e.target.value)} className="w-full px-3 py-2 border rounded-md">
                <option>Anwar Al Madinah</option>
                <option>Movenpick</option>
                <option>Pullman Zamzam</option>
                <option>Dar Al Taqwa</option>
              </select>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-bold mb-3">Transport</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Transport</label>
              <select value={transport} onChange={(e) => setTransport(e.target.value)} className="w-full px-3 py-2 border rounded-md">
                <option>Private</option>
                <option>Group Bus</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-[#1e3a8a] text-white rounded-lg p-6 text-center">
          <p className="text-sm mb-1">Estimated Total Cost</p>
          <p className="text-3xl font-bold">PKR {totalCost.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
