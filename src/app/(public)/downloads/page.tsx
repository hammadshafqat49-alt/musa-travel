import { getDownloads } from "@/lib/data";
import { FileText, Download } from "lucide-react";

export default async function DownloadsPage() {
  const downloads = await getDownloads() as any[];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-[#0c1d4a] mb-4">Downloads</h1>
        <p className="text-gray-600">Download brochures, rate sheets, and other important documents.</p>
      </div>

      <div className="space-y-4">
        {downloads.map((d) => (
          <div key={d.id} className="bg-white rounded-lg shadow-sm border p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#dc2626]/10 rounded-lg flex items-center justify-center">
                <FileText className="text-[#dc2626]" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-[#0c1d4a]">{d.title}</h3>
                <p className="text-sm text-gray-500">{d.category}</p>
              </div>
            </div>
            <button className="flex items-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              <Download size={16} /> Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
