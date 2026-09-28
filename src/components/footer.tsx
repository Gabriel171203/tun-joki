import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Heart, QrCode } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { cleanPhoneNumber } from "@/lib/utils";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const waNumber = cleanPhoneNumber(SITE_CONFIG.adminWhatsapp);

  return (
    <footer className="bg-navy-950 text-earth-100 pt-16 pb-12 border-t border-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-navy-800/80">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <img src="/image.svg" alt="Tuntasin" className="h-10 w-auto bg-[#F7EEF4] rounded-lg px-4 py-2" />
            </div>
            <p className="text-earth-300 text-sm leading-relaxed max-w-sm">
              Platform layanan asistensi tugas akademik dan proyek pemrograman IT terpercaya untuk mahasiswa Indonesia. Dikerjakan manual oleh tim ahli, bukan bot kaku.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-emerald-400 font-medium">
              <span className="flex items-center gap-1.5 bg-navy-900 px-3 py-1.5 rounded-xl border border-navy-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Identitas Tidak Dipublikasikan
              </span>
              <span className="flex items-center gap-1.5 bg-navy-900 px-3 py-1.5 rounded-xl border border-navy-800 text-terracotta-300">
                <QrCode className="w-4 h-4" />
                Pembayaran QRIS Resmi
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white">Layanan</h4>
            <ul className="space-y-2.5 text-sm text-earth-300">
              <li>
                <Link href="/order?category=it_dev" className="hover:text-terracotta-400 transition-colors">
                  IT & Pemrograman
                </Link>
              </li>
              <li>
                <Link href="/order?category=academic_doc" className="hover:text-terracotta-400 transition-colors">
                  Makalah & Karya Ilmiah
                </Link>
              </li>
              <li>
                <Link href="/order?category=media_presentation" className="hover:text-terracotta-400 transition-colors">
                  Slide PPT & Video
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigasi Cepat */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white">Fitur</h4>
            <ul className="space-y-2.5 text-sm text-earth-300">
              <li>
                <Link href="/order" className="hover:text-terracotta-400 transition-colors">
                  Pesan Tugas Baru
                </Link>
              </li>
              <li>
                <Link href="/#kalkulator" className="hover:text-terracotta-400 transition-colors">
                  Kalkulator Biaya
                </Link>
              </li>
              <li>
                <Link href="/tracking" className="hover:text-terracotta-400 transition-colors">
                  Cek Status Pesanan
                </Link>
              </li>
              <li>
                <Link href="/#komitmen" className="hover:text-terracotta-400 transition-colors">
                  Standar Mutu
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-terracotta-400 transition-colors">
                  Tanya Jawab (FAQ)
                </Link>
              </li>
            </ul>
          </div>

          {/* Bantuan & Kontak */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white">Bantuan</h4>
            <ul className="space-y-2.5 text-sm text-earth-300">
              <li>
                <Link href="/terms" className="hover:text-terracotta-400 transition-colors">
                  Syarat & Ketentuan (ToS)
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-terracotta-400 transition-colors">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="hover:text-terracotta-400 transition-colors">
                  Kritik & Saran
                </Link>
              </li>
              <li className="pt-2">
                <a
                  href={`https://wa.me/${waNumber}?text=${encodeURIComponent("Halo Admin Tuntasin, saya mau tanya-tanya seputar layanan...")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow transition-all"
                >
                  <Image src="/whatsapp-logo-white.png" alt="" aria-hidden width={20} height={20} className="w-3.5 h-3.5" />
                  Chat WhatsApp Admin
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Academic Ethics Disclaimer */}
        <div className="pt-8 pb-6 text-xs text-earth-400 leading-relaxed max-w-4xl">
          <p>
            <span className="font-semibold text-earth-300">Disclaimer Akademik:</span> Seluruh berkas tugas, source code, tulisan makalah, dan bahan presentasi yang diproduksi oleh tim Tuntasin disiapkan sebagai bahan asistensi belajar mandiri, bimbingan logika pemrograman, dan referensi riset ilmiah. Klien diharapkan mempelajari materi yang diberikan demi pemahaman substansi mata kuliah secara berintegritas.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-navy-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-earth-400">
          <p>© {currentYear} Tuntasin. Seluruh Hak Cipta Dilindungi.</p>
          <p className="flex items-center gap-1.5">
            Dibuat dengan rasa peduli <Heart className="w-3.5 h-3.5 text-terracotta-400 fill-terracotta-400" /> untuk meringankan beban mahasiswa Indonesia.
          </p>
        </div>
      </div>
    </footer>
  );
}
