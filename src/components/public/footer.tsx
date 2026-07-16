import Link from "next/link";
import { MapPin, Phone, Mail, Globe } from "lucide-react";

export default function PublicFooter() {
  return (
    <footer className="bg-[#1e3a8a] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-bold mb-4">Details About Musa Travel Service</h3>
          <div className="space-y-2 text-sm text-gray-300">
            <p className="flex items-start gap-2"><MapPin size={16} className="mt-1 shrink-0" /> Gulberg 3, Main Boulevard, Eden Tower LGF 6/8 Lahore</p>
            <p className="flex items-center gap-2"><Phone size={16} /> 24/7 customer support: 0333 4390349 / 03390000007</p>
            <p className="flex items-center gap-2"><Mail size={16} /> musatravelagnecy1@gmail.com</p>
            <p className="flex items-center gap-2"><Globe size={16} /> https://travelwithmusa.com/</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4">Our Products</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link href="/one-way-groups" className="hover:text-[#dc2626]">One Way Groups</Link></li>
            <li><Link href="/umrah-groups" className="hover:text-[#dc2626]">Umrah Groups</Link></li>
            <li><Link href="/umrah-packages" className="hover:text-[#dc2626]">Umrah Packages</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4">Follow Us</h3>
          <div className="flex gap-3 text-sm">
            <a href="#" className="hover:text-[#dc2626]">f</a>
            <a href="#" className="hover:text-[#dc2626]">t</a>
            <a href="#" className="hover:text-[#dc2626]">i</a>
            <a href="#" className="hover:text-[#dc2626]">in</a>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4">Cheapest Rates for Agents</h3>
          <p className="text-sm text-gray-300">
            Register as an agent to get exclusive rates and commissions on all bookings.
          </p>
          <Link href="/agent/login" className="inline-block mt-3 text-sm text-[#dc2626] hover:underline">Agent Login &rarr;</Link>
        </div>
      </div>

    </footer>
  );
}
