"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppFloat({ phone = "03390000007" }: { phone?: string }) {
  const cleaned = phone.replace(/\D/g, "");
  const href = `https://wa.me/${cleaned}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
    >
      <MessageCircle size={28} fill="currentColor" />
    </a>
  );
}
