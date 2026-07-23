import PublicNavbar from "@/components/public/navbar";
import PublicFooter from "@/components/public/footer";
import WhatsAppFloat from "@/components/public/whatsapp-float";

export const dynamic = "force-dynamic";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <div className="flex-1">{children}</div>
      <PublicFooter />
      <WhatsAppFloat phone="03390000007" />
    </div>
  );
}
