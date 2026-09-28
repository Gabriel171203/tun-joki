"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, ShieldCheck, Search } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/#layanan", label: "Layanan" },
    { href: "/#kalkulator", label: "Hitung Biaya" },
    { href: "/#keunggulan", label: "Kenapa Kami?" },
    { href: "/#alur", label: "Cara Pesan" },
    { href: "/#komitmen", label: "Standar Mutu" },
    { href: "/#faq", label: "FAQ" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#F7EEF4]/90 backdrop-blur-md border-b border-earth-200/70 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            
            <img src="/image.svg" alt="Tuntasin" className="h-14 w-auto" />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-earth-800 hover:text-terracotta-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-3.5">
            <Link href="/tracking">
              <Button variant="ghost" size="sm" className="font-semibold text-earth-800">
                <Search className="w-4 h-4 text-terracotta-500" />
                Cek Status
              </Button>
            </Link>

            <Link href="/order">
              <Button variant="primary" size="md" className="font-semibold">
                Pesan Tugas Baru
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <Link href="/order">
              <Button variant="primary" size="sm" className="font-semibold px-3 py-1.5 text-xs">
                Pesan
              </Button>
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-3 rounded-xl text-earth-800 hover:bg-earth-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 focus-visible:ring-offset-2"
              aria-label="Buka/Tutup Menu Navigasi"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-earth-200 bg-[#F7EEF4] px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="px-3 py-2.5 rounded-xl text-base font-medium text-earth-900 hover:bg-earth-100 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-earth-200 flex flex-col gap-2.5">
            <Link href="/tracking" onClick={() => setIsOpen(false)} className="w-full">
              <Button variant="secondary" className="w-full justify-center">
                <Search className="w-4 h-4 text-terracotta-500" />
                Cek Status Pesanan
              </Button>
            </Link>

            <Link href="/order" onClick={() => setIsOpen(false)} className="w-full">
              <Button variant="primary" className="w-full justify-center">
                Buat Pesanan Baru (QRIS)
              </Button>
            </Link>
          </div>

          <div className="pt-2 text-center text-xs text-earth-600 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Rahasia & Bebas Plagiasi</span>
          </div>
        </div>
      )}
    </header>
  );
}
