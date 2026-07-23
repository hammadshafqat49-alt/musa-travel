"use client";

import Image from "next/image";

export default function WhatsAppFloat({ phone = "03390000007" }: { phone?: string }) {
  const cleaned = phone.replace(/\D/g, "");
  const href = `https://api.whatsapp.com/send?phone=92${cleaned.slice(-10)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden bg-white"
    >
      <Image
        src="/whatsapp-icon.svg"
        alt="WhatsApp"
        width={56}
        height={56}
        className="w-full h-full object-contain"
      />
    </a>
  );
}
