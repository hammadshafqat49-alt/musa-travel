import AgentSidebar from "@/components/agent/sidebar";
import AgentHeader from "@/components/agent/header";

export const dynamic = "force-dynamic";

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AgentSidebar />
      <div className="flex-1 flex flex-col ml-64">
        <AgentHeader />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
