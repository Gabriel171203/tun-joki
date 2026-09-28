import React from "react";
import Link from "next/link";
import Image from "next/image";
import { WORKFLOW_STEPS, SITE_CONFIG } from "@/lib/constants";
import { cleanPhoneNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calculator, ShieldCheck, Clock } from "lucide-react";

export function WorkflowSection() {
  const waNumber = cleanPhoneNumber(SITE_CONFIG.adminWhatsapp);

  return (
    <section id="alur" className="py-20 bg-[#F7EEF4] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4 mb-14">
          <p className="text-xs font-bold text-terracotta-600">Alur Kerja Cepat & Jelas</p>
          <h2 className="text-3xl sm:text-4xl font-black text-navy-950 tracking-tight">
            5 Langkah Mudah Sampai Tugas Tuntas
          </h2>
          <p className="text-base sm:text-lg text-earth-700">
            Proses pemesanan didesain cepat dan fleksibel. Diskusi langsung untuk tugas koding dan skripsi, atau hitung instan untuk slide presentasi dan video.
          </p>
        </div>

        {/* Workflow Horizontal/Grid Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5">
          {WORKFLOW_STEPS.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border-2 border-earth-200/80 p-6 flex flex-col justify-between shadow-warm relative group hover:border-terracotta-400 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-terracotta-500 font-sans">
                    {item.step}
                  </span>
                  <span className="text-[10px] font-bold text-earth-700 bg-earth-100 px-2 py-0.5 rounded-full">
                    Step {idx + 1}
                  </span>
                </div>

                <h3 className="text-base font-bold text-navy-950 mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-earth-700 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {idx < WORKFLOW_STEPS.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <div className="w-6 h-6 rounded-full bg-white border border-earth-500 flex items-center justify-center text-earth-600 shadow-sm">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Dual-Track CTA Banner (Revamped) */}
        <div className="mt-16 max-w-4xl mx-auto rounded-[2.25rem] bg-white border-2 border-earth-200/90 shadow-warm-lg p-7 sm:p-9 relative overflow-hidden">
          {/* Subtle warm accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-terracotta-500 to-emerald-500" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left copy (7 cols) */}
            <div className="lg:col-span-7 space-y-3 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-earth-100 text-earth-800 text-xs font-semibold">
                <Clock className="w-3.5 h-3.5 text-terracotta-500" />
                Respon Admin via WhatsApp
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-navy-950 tracking-tight">
                Punya Tugas Kodingan Rumit atau Skripsi Mentok?
              </h3>

              <p className="text-xs sm:text-sm text-earth-700 leading-relaxed">
                Konsultasikan langsung dengan admin kami secara santai. Tanpa biaya dan tanpa komitmen sampai Anda dan tim kami menyepakati harga yang pas.
              </p>

              <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-earth-600 font-medium">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Garansi Revisi Sepuasnya
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Identitas Dirahasiakan
                </span>
              </div>
            </div>

            {/* Right action buttons (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-3 justify-center">
              <a
                href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                  "Halo Admin Tuntasin, saya mau konsultasi tugas coding / skripsi saya..."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button
                  variant="emerald"
                  size="lg"
                  className="w-full justify-center text-sm font-bold shadow-warm"
                >
                  <Image src="/whatsapp-logo-white.png" alt="" aria-hidden width={20} height={20} className="w-4 h-4" />
                  Konsultasi Coding & Skripsi
                </Button>
              </a>

              <Link href="/order?category=media_presentation" className="w-full">
                <Button
                  variant="secondary"
                  size="md"
                  className="w-full justify-center text-xs font-bold border-earth-500"
                >
                  <Calculator className="w-4 h-4 text-terracotta-600" />
                  Pesan Tugas PPT / Edit Video
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
