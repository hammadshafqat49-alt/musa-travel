import { getAgent } from "@/lib/auth";
import { getAgentById } from "@/lib/data";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const agentToken = await getAgent();
  if (!agentToken) redirect("/agent/login");

  const agent = await getAgentById(Number(agentToken.id)) as any;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>

      <div className="bg-white rounded-lg shadow-sm border p-6 max-w-2xl">
        <form action="/api/agent/profile" method="POST" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Agent Code</label>
              <input type="text" defaultValue={agent?.code} disabled className="w-full px-3 py-2 border rounded-md bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" defaultValue={agent?.email} disabled className="w-full px-3 py-2 border rounded-md bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Agency Name</label>
              <input type="text" name="agency_name" defaultValue={agent?.agency_name || ""} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#dc2626] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
              <input type="text" name="contact_person" defaultValue={agent?.contact_person || ""} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#dc2626] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="text" name="phone" defaultValue={agent?.phone || ""} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#dc2626] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input type="text" name="city" defaultValue={agent?.city || ""} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#dc2626] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input type="text" name="country" defaultValue={agent?.country || ""} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#dc2626] outline-none" />
            </div>
          </div>
          <button type="submit" className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-6 py-2 rounded-md font-medium">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}
