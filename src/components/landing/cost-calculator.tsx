"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatRupiah, cleanPhoneNumber } from "@/lib/utils";
import { SITE_CONFIG, DEADLINE_TIERS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Presentation,
  Video,
  Code2,
  BookOpen,
  ShieldCheck,
  QrCode,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

export function CostCalculator() {
  const [activeTab, setActiveTab] = useState<"media" | "complex">("media");

  // State untuk Tab Media (PPT & Video)
  const [mediaType, setMediaType] = useState<"ppt" | "video">("ppt");
  const [volumeTier, setVolumeTier] = useState<number>(1); // 0: kecil, 1: sedang, 2: besar
  const [deadlineHours, setDeadlineHours] = useState<number>(48);

  const waNumber = cleanPhoneNumber(SITE_CONFIG.adminWhatsapp);

  // Kalkulasi harga media
  const pptOptions = [
    { label: "5 - 10 Slide Ringkas", base: 60000, desc: "Cocok untuk tugas mingguan atau presentasi kelompok singkat." },
    { label: "11 - 20 Slide Standar", base: 110000, desc: "Paling populer untuk ujian tengah/akhir semester & seminar." },
    { label: "21 - 35+ Slide Komprehensif", base: 180000, desc: "Untuk sidang skripsi, proposal tesis, atau pitch deck profesional." },
  ];

  const videoOptions = [
    { label: "Durasi 1 - 3 Menit", base: 85000, desc: "Format video pendek, Reels, TikTok edukasi, atau bumper tugas." },
    { label: "Durasi 4 - 7 Menit", base: 150000, desc: "Vlog tugas kelompok, simulasi praktikum, atau mini dokumenter." },
    { label: "Durasi 8 - 15+ Menit", base: 250000, desc: "Video presentasi panjang, talkshow kampus, atau video profil." },
  ];

  const selectedTierConfig = mediaType === "ppt" ? pptOptions[volumeTier] : videoOptions[volumeTier];
  const basePrice = selectedTierConfig.base;

  let urgencyFactor = 1.0;
  if (deadlineHours <= 12) urgencyFactor = 1.5;
  else if (deadlineHours <= 24) urgencyFactor = 1.3;
  else if (deadlineHours <= 72) urgencyFactor = 1.0;
  else urgencyFactor = 0.85;

  const estimatedTotal = Math.round((basePrice * urgencyFactor) / 5000) * 5000;
  const estimatedDp = Math.round((estimatedTotal * 0.5) / 5000) * 5000;

  return (
    <section id="kalkulator" className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4 mb-12">
          <p className="text-xs font-bold text-terracotta-600">Transparansi Alur & Biaya</p>
          <h2 className="text-3xl sm:text-4xl font-black text-navy-950 tracking-tight">
            Perhitungan Biaya & Konsultasi Tugas
          </h2>
          <p className="text-base sm:text-lg text-earth-700">
            Tugas terstandarisasi (Slide PPT & Video) dapat dihitung instan. Untuk tugas pemrograman IT dan Karya Ilmiah, silakan konsultasi langsung dengan admin agar harga adil sesuai modul.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <button
            type="button"
            onClick={() => setActiveTab("media")}
            className={`px-5 py-3 min-h-[44px] rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
              activeTab === "media"
                ? "bg-navy-950 text-white shadow-warm"
                : "bg-white text-earth-700 border border-earth-500 hover:bg-earth-100"
            }`}
          >
            <Presentation className="w-4 h-4 text-terracotta-300" />
            Kalkulator Slide PPT & Edit Video
            <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded-md uppercase font-black">
              Instan
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("complex")}
            className={`px-5 py-3 min-h-[44px] rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
              activeTab === "complex"
                ? "bg-navy-950 text-white shadow-warm"
                : "bg-white text-earth-700 border border-earth-500 hover:bg-earth-100"
            }`}
          >
            <Code2 className="w-4 h-4 text-terracotta-400" />
            IT / Coding & Karya Ilmiah / Skripsi
            <span className="text-[10px] bg-terracotta-600 text-white px-1.5 py-0.5 rounded-md uppercase font-black">
              Via Admin
            </span>
          </button>
        </div>

        {/* Tab 1: Kalkulator Media (PPT & Video) */}
        {activeTab === "media" ? (
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border-2 border-earth-200/90 shadow-warm-lg p-6 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
              {/* Left Controls (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Pilihan Jenis Media */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-bold text-navy-950">
                    1. Pilih Jenis Media Tugas:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setMediaType("ppt")}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all flex items-center gap-3 ${
                        mediaType === "ppt"
                          ? "border-navy-700 bg-navy-50 shadow-sm"
                          : "border-earth-200 bg-earth-50/40 hover:bg-earth-100/60"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-navy-100 text-navy-800 flex items-center justify-center shrink-0">
                        <Presentation className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-navy-950">Slide PPT / Canva</p>
                        <p className="text-[11px] text-earth-600">Presentasi & Sidang</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMediaType("video")}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all flex items-center gap-3 ${
                        mediaType === "video"
                          ? "border-terracotta-500 bg-terracotta-50/80 shadow-sm"
                          : "border-earth-200 bg-earth-50/40 hover:bg-earth-100/60"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-terracotta-100 text-terracotta-800 flex items-center justify-center shrink-0">
                        <Video className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-navy-950">Video Editing Tugas</p>
                        <p className="text-[11px] text-earth-600">Reels / Vlog / Presentasi</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Pilihan Volume (Slide atau Durasi) */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-bold text-navy-950">
                    2. {mediaType === "ppt" ? "Perkiraan Jumlah Slide:" : "Perkiraan Durasi Video:"}
                  </label>
                  <div className="space-y-2">
                    {(mediaType === "ppt" ? pptOptions : videoOptions).map((opt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setVolumeTier(idx)}
                        className={`w-full p-3 min-h-[44px] rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                          volumeTier === idx
                            ? "border-emerald-600 bg-emerald-50/70 shadow-sm"
                            : "border-earth-200 bg-white hover:bg-earth-50"
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold text-navy-950">{opt.label}</p>
                          <p className="text-[11px] text-earth-600">{opt.desc}</p>
                        </div>
                        <span className="text-xs font-black text-navy-950 shrink-0 ml-3">
                          {formatRupiah(opt.base)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pilihan Deadline */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-navy-950">
                      3. Waktu Deadline Pengumpulan:
                    </label>
                    <span className="text-xs font-bold text-terracotta-600">
                      {DEADLINE_TIERS.find((t) => t.hours === deadlineHours)?.badge || "Standar"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {DEADLINE_TIERS.map((tier) => (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => setDeadlineHours(tier.hours)}
                        className={`p-2.5 min-h-[44px] rounded-xl border-2 text-center transition-all ${
                          deadlineHours === tier.hours
                            ? "border-terracotta-500 bg-terracotta-50 text-terracotta-900 font-bold"
                            : "border-earth-200 bg-white text-earth-700 hover:bg-earth-50"
                        }`}
                      >
                        <p className="text-xs">{tier.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Output Box (5 cols) */}
              <div className="lg:col-span-5 bg-earth-50/90 rounded-2xl border-2 border-earth-200 p-6 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-earth-200">
                    <span className="text-xs font-bold text-earth-700">
                      Estimasi Biaya Transparan
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Garansi Revisi
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between text-xs text-earth-700">
                      <span>Harga Paket Dasar</span>
                      <span>{formatRupiah(basePrice)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-earth-700">
                      <span>Urgensi Waktu</span>
                      <span>x{urgencyFactor}</span>
                    </div>

                    <div className="pt-3 border-t border-earth-200">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs font-bold text-navy-950">Total Perkiraan:</span>
                        <span className="text-2xl font-black text-terracotta-600">
                          {formatRupiah(estimatedTotal)}
                        </span>
                      </div>
                    </div>

                    {/* DP 50% Box */}
                    <div className="mt-3 p-3.5 rounded-xl bg-white border border-terracotta-200/90 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-emerald-800 flex items-center gap-1">
                          <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                          Cukup DP 50% (QRIS):
                        </span>
                        <span className="text-sm font-black text-emerald-700">
                          {formatRupiah(estimatedDp)}
                        </span>
                      </div>
                      <p className="text-[11px] text-earth-600">
                        Sisa pelunasan ({formatRupiah(estimatedTotal - estimatedDp)}) dibayar setelah draft tugas selesai direview.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link
                    href={`/order?category=media_presentation&difficulty=medium&hours=${deadlineHours}`}
                    className="block w-full"
                  >
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full justify-center text-sm font-bold shadow-warm"
                    >
                      Pesan Tugas Media / PPT Ini
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>

                  <div className="text-center">
                    <a
                      href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                        `Halo Admin Tuntasin, saya mau pesan ${
                          mediaType === "ppt" ? "Slide PPT" : "Edit Video"
                        } (${selectedTierConfig.label}). Estimasi di web sekitar ${formatRupiah(estimatedTotal)}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-earth-600 hover:text-terracotta-600 font-semibold inline-flex items-center gap-1"
                    >
                      <Image src="/whatsapp-logo.png" alt="" aria-hidden width={20} height={20} className="w-3.5 h-3.5" />
                      Atau Mau Tanya Dulu ke Admin via WA
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Tab 2: Penjelasan & Konsultasi Coding & Skripsi */
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border-2 border-earth-200 p-8 sm:p-12 shadow-warm space-y-8">
            <div className="space-y-3 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta-50 text-terracotta-800 text-xs font-bold border border-terracotta-200">
                <HelpCircle className="w-4 h-4 text-terracotta-600" />
                Alur Khusus Tugas Kompleks
              </div>
              <h3 className="text-2xl font-black text-navy-950">
                Mengapa Tugas Coding & Skripsi Menggunakan Konsultasi Langsung?
              </h3>
              <p className="text-sm text-earth-700 leading-relaxed">
                Tiap tugas kodingan (Next.js, Flutter, Python, SQL, algoritma) maupun skripsi/makalah memiliki variabel yang sangat berbeda. Menggunakan kalkulator kaku berisiko membebankan biaya yang terlalu mahal untuk soal sederhana atau terlalu murah untuk sistem skala besar.
              </p>
            </div>

            {/* Keunggulan Konsultasi Langsung */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-earth-50 border border-earth-200/80 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-terracotta-100 text-terracotta-700 flex items-center justify-center font-bold">
                  <Code2 className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-navy-950">Review Modul / Soal</h4>
                <p className="text-xs text-earth-600 leading-relaxed">
                  Admin dan programmer membaca file PDF/soal tugas Anda terlebih dahulu agar estimasi akurat.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-earth-50 border border-earth-200/80 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-navy-950">Harga Fleksibel & Nego</h4>
                <p className="text-xs text-earth-600 leading-relaxed">
                  Bisa disesuaikan dengan budget mahasiswa dan tingkat deadline (reguler atau kilat).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-earth-50 border border-earth-200/80 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-earth-200 text-earth-800 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-navy-950">Garansi & Demo Siap</h4>
                <p className="text-xs text-earth-600 leading-relaxed">
                  Disediakan video panduan run kodingan dan laporan Turnitin resmi untuk skripsi Anda.
                </p>
              </div>
            </div>

            {/* CTA Box */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-navy-950 to-navy-900 text-white flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="text-base font-bold text-white">
                  Siap Konsultasikan Tugas Coding atau Skripsi Anda?
                </h4>
                <p className="text-xs text-earth-300">
                  Langsung terhubung dengan admin. Kirim modul soal Anda sekarang juga!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <a
                  href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                    "Halo Admin Tuntasin, saya ingin konsultasi tugas coding / skripsi saya..."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button variant="emerald" size="md" className="w-full sm:w-auto font-bold text-xs shadow-warm">
                    <Image src="/whatsapp-logo-white.png" alt="" aria-hidden width={20} height={20} className="w-4 h-4" />
                    Chat WhatsApp Admin Langsung
                  </Button>
                </a>

                <Link href="/order?category=it_dev" className="w-full sm:w-auto">
                  <Button variant="secondary" size="md" className="w-full sm:w-auto font-bold text-xs text-navy-950">
                    Isi Form Brief Dulu
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
