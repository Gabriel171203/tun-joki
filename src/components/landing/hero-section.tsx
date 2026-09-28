import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Calculator,
  ShieldCheck,
  CheckCircle2,
  QrCode,
} from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Col (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Friendly Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-terracotta-200/80 shadow-sm">
              <span className="text-xs font-bold text-navy-950 tracking-tight">
                Tim Akademisi & Software Engineer
              </span>
              <span className="font-hand text-base text-terracotta-600 font-bold -rotate-3 ml-1">
                (Bukan Bot AI!)
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black text-navy-950 tracking-tight leading-[1.15]">
              Deadline Tugas Numpuk? <br />
              <span className="text-terracotta-600">
                Serahkan pada Ahlinya,
              </span>{" "}
              Beres Tepat Waktu.
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-earth-800 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              Konsultasi langsung untuk tugas <strong>coding &amp; skripsi</strong> dengan harga yang disepakati bersama, atau pesan instan untuk <strong>slide PPT &amp; edit video</strong> dengan estimasi biaya otomatis. Dikerjakan manual dan teliti, privasi terlindungi.
            </p>

            {/* Trust Checklist Points */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs sm:text-sm font-semibold text-earth-900 max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Tanpa Generasi Bot AI</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Garansi Revisi Tuntas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Bebas Plagiasi Turnitin</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Mode Pemesan Anonim</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cukup DP 50% QRIS</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verifikasi Instan via WA</span>
              </div>
            </div>

            {/* Call To Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/order" className="w-full sm:w-auto">
                <Button size="lg" variant="primary" className="w-full sm:w-auto text-base shadow-warm-lg">
                  Pesan Joki / Konsultasi
                </Button>
              </Link>
              <Link href="#kalkulator" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto text-base">
                  <Calculator className="w-5 h-5 text-terracotta-600" />
                  Hitung Estimasi Biaya
                </Button>
              </Link>
            </div>

            {/* Payment Logos Micro Ribbon */}
            <div className="pt-4 border-t border-earth-200/60 flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2 text-xs text-earth-600">
              <span className="font-semibold text-earth-800 flex items-center gap-1">
                <QrCode className="w-3.5 h-3.5 text-terracotta-500" />
                Dukungan Pembayaran:
              </span>
              <span className="bg-white px-2 py-0.5 rounded-md border border-earth-200 font-bold text-navy-950">QRIS Resmi</span>
              <span>BCA</span>
              <span>•</span>
              <span>Mandiri</span>
              <span>•</span>
              <span>BRI</span>
              <span>•</span>
              <span>GoPay</span>
              <span>•</span>
              <span>DANA</span>
              <span>•</span>
              <span>ShopeePay</span>
            </div>
          </div>

          {/* Right Visual Card (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md">
              {/* Organic Shape Backing */}
              <div className="absolute -inset-2 bg-terracotta-300/70 rounded-[2.5rem] rotate-2 opacity-70" />

              {/* Main Card */}
              <div className="relative bg-white rounded-[2.25rem] border-2 border-earth-200 p-6 sm:p-7 shadow-warm-lg space-y-5">
                {/* Header Card */}
                <div className="flex items-center justify-between pb-3 border-b border-earth-100">
                  <div className="flex items-center gap-2.5">
                    
                    <div>
                      <h4 className="text-sm font-bold text-navy-950">Alur Mudah & Transparan</h4>
                      <p className="text-[11px] text-earth-600">Tanpa ribet, langsung tertangani</p>
                    </div>
                  </div>
                </div>

                {/* Step Mockup Cards */}
                <div className="space-y-3 text-left">
                  <div className="p-3 rounded-2xl bg-earth-50 border border-earth-200/70 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-terracotta-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <p className="text-xs font-bold text-navy-950">Upload Soal & Tentukan Deadline</p>
                      <p className="text-[11px] text-earth-600">Bisa mode anonim tanpa nama asli kampus.</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-earth-50 border border-earth-200/70 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-navy-700 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <p className="text-xs font-bold text-navy-950">Scan QRIS untuk DP 50%</p>
                      <p className="text-[11px] text-earth-600">Scan dari m-Banking atau E-Wallet apa pun.</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-earth-50 border border-earth-200/70 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <p className="text-xs font-bold text-navy-950">Terhubung ke WhatsApp Admin</p>
                      <p className="text-[11px] text-earth-600">Tugas langsung dieksekusi, bergaransi revisi.</p>
                    </div>
                  </div>
                </div>

                {/* Bottom Value Props */}
                <div className="pt-2 grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <p className="text-sm font-black text-emerald-800">Manual & Teliti</p>
                    <p className="text-[11px] text-emerald-700 font-medium">Bebas Generasi Bot AI</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-terracotta-50 border border-terracotta-100">
                    <p className="text-sm font-black text-terracotta-800">Privasi Terjaga</p>
                    <p className="text-[11px] text-terracotta-700 font-medium">Nama Berkas Diacak</p>
                  </div>
                </div>
              </div>

              {/* Floating Note Badge */}
              <div className="absolute -bottom-5 -right-4 bg-navy-900 text-white px-4 py-2 rounded-2xl shadow-lg border border-navy-800 flex items-center gap-2 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold">Berkas Bisa Dihapus</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
