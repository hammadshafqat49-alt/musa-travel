"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone, Mail, User } from "lucide-react";

export default function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/umrah-packages", label: "Umrah Packages" },
    { href: "/umrah-groups", label: "Umrah Groups" },
    { href: "/hotels", label: "Hotels" },
    { href: "/contact", label: "Contact Us" },
  ];

  return (
    <header className="w-full">
      <div className="bg-[#1e3a8a] text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Phone size={14} /> 0333 4390349 / 03390000007</span>
            <span className="flex items-center gap-1"><Mail size={14} /> musatravelagnecy1@gmail.com</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-[#2563eb]">f</a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-[#2563eb]">t</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#2563eb]">i</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[#2563eb]">in</a>
          </div>
        </div>
      </div>

      <nav className="bg-[#1e3a8a] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.jpeg" alt="Musa Travel Service" className="h-12 w-auto object-contain" />
            <span className="hidden sm:block text-lg font-bold text-white">
              Travel with Musa
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white hover:text-white/80 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/agent/login"
              className="flex items-center gap-1 text-sm font-medium text-white bg-[#2563eb] hover:bg-[#1e3a8a] px-4 py-2 rounded-md transition-colors"
            >
              <User size={16} /> Agent Login
            </Link>
            <Link
              href="/admin/login"
              className="flex items-center gap-1 text-sm font-medium text-white border border-white/40 hover:bg-[#2563eb] hover:text-white px-4 py-2 rounded-md transition-colors"
            >
              Admin
            </Link>
          </div>

          <button
            className="lg:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden bg-[#1e3a8a] border-t border-white/20 px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-sm font-medium text-white hover:text-white/80"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/agent/login"
              className="block text-sm font-medium text-white bg-[#2563eb] hover:bg-[#1e3a8a] px-4 py-2 rounded-md text-center"
              onClick={() => setMobileOpen(false)}
            >
              Agent Login
            </Link>
            <Link
              href="/admin/login"
              className="block text-sm font-medium text-white border border-white/40 hover:bg-[#2563eb] hover:text-white px-4 py-2 rounded-md text-center"
              onClick={() => setMobileOpen(false)}
            >
              Admin Login
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
