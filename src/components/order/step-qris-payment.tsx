"use client";

import React, { useState } from "react";
import Image from "next/image";
import { OrderFormData, OrderCalculation } from "@/types/order";
import { formatRupiah } from "@/lib/utils";
import { SERVICE_CATEGORIES, DIFFICULTY_RATES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Download,
  Copy,
  Check,
  ArrowLeft,
  ArrowRight,
  Smartphone,
} from "lucide-react";

interface StepQrisPaymentProps {
  formData: OrderFormData;
  pricing: OrderCalculation;
  onNext: () => void;
  onBack: () => void;
}

export function StepQrisPayment({ formData, pricing, onNext, onBack }: StepQrisPaymentProps) {
  const [copied, setCopied] = useState(false);

  const categoryName =
    SERVICE_CATEGORIES.find((c) => c.id === formData.service_category)?.title ||
    formData.service_category;

  const handleCopyAmount = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(pricing.dpAmount.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadQRIS = () => {
    const link = document.createElement("a");
    link.href = "/qris-image.webp";
    link.download = "QRIS-Tuntasin.webp";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-navy-950">
          Langkah 2: Ringkasan & Pembayaran DP via QRIS
        </h2>
        <p className="text-xs sm:text-sm text-earth-700 mt-1">
          Cukup bayar uang muka (DP) 50% untuk mengamankan slot pengerjaan tugas Anda. Pelunasan sisa dibayar setelah tugas selesai.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Order Summary Recap (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-earth-50/80 rounded-3xl border-2 border-earth-200/80 p-6 space-y-4">
            <h3 className="text-sm font-bold text-navy-950 pb-2 border-b border-earth-200">
              Ringkasan Pesanan Tugas
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-earth-600">Pemesan:</span>
                <span className="font-bold text-navy-950">
                  {formData.is_anonymous ? `${formData.client_name} (Anonim)` : formData.client_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-earth-600">No. WhatsApp:</span>
                <span className="font-bold text-navy-950">{formData.whatsapp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-earth-600">Kategori Layanan:</span>
                <span className="font-bold text-navy-950">{categoryName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-earth-600">Judul Tugas:</span>
                <span className="font-bold text-navy-950 text-right max-w-[200px] truncate">
                  {formData.task_title}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-earth-600">Batas Deadline:</span>
                <span className="font-bold text-terracotta-600">
                  {formData.deadline_date} ({formData.deadline_time} WIB)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-earth-600">Kerumitan:</span>
                <span className="font-bold text-navy-950">
                  {DIFFICULTY_RATES[formData.difficulty]?.label}
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="pt-4 border-t border-earth-200 space-y-2.5">
              <div className="flex justify-between text-xs text-earth-600">
                <span>Total Estimasi Biaya:</span>
                <span className="font-bold text-navy-950">{formatRupiah(pricing.totalPrice)}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border-2 border-emerald-500/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-emerald-800 block">
                    DP Wajib Dibayar (50%):
                  </span>
                  <span className="text-2xl font-black text-emerald-700">
                    {formatRupiah(pricing.dpAmount)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyAmount}
                  className="px-3 py-1.5 min-h-[44px] rounded-xl bg-earth-100 hover:bg-earth-200 text-earth-800 text-xs font-semibold flex items-center gap-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Tersalin!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Salin Angka
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-earth-700 italic">
                * Sisa pelunasan ({formatRupiah(pricing.remainingAmount)}) dibayarkan setelah Anda memeriksa hasil pengerjaan.
              </p>
            </div>
          </div>

          {/* Payment Instructions Accordion/List */}
          <div className="bg-white rounded-3xl border border-earth-200 p-6 space-y-3">
            <h4 className="text-xs font-bold text-navy-950 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-terracotta-500" />
              Cara Membayar via QRIS:
            </h4>
            <ol className="text-xs text-earth-700 space-y-2 list-decimal list-inside leading-relaxed">
              <li>Buka aplikasi <strong>m-Banking</strong> (BCA, Mandiri, BRI, BNI, BSI) atau <strong>E-Wallet</strong> (GoPay, OVO, DANA, ShopeePay).</li>
              <li>Pilih menu <strong>Scan QR / Bayar QRIS</strong>.</li>
              <li>Scan kode QRIS di samping, atau simpan/unduh gambar lalu unggah dari galeri HP Anda.</li>
              <li>Ketik nominal DP sebesar <strong>{formatRupiah(pricing.dpAmount)}</strong>.</li>
              <li>Selesaikan transaksi dan <strong>Screenshot Bukti Transfer</strong>.</li>
            </ol>
          </div>
        </div>

        {/* Right Col: Official QRIS Image & Actions (6 cols) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <div className="w-full max-w-sm bg-white rounded-3xl border-2 border-earth-500 p-6 shadow-warm-lg space-y-4 text-center">
            <div className="flex items-center justify-between pb-2 border-b border-earth-100">
              <span className="text-[11px] font-bold text-navy-950">KODE QRIS RESMI</span>
            </div>

            {/* QRIS SVG Component Container */}
            <div className="relative aspect-[400/560] w-full rounded-2xl overflow-hidden border border-earth-200 shadow-inner bg-white">
              <Image
                src="/qris-image.webp"
                alt="Kode QRIS Resmi Tuntasin"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Download & Actions */}
            <div className="space-y-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleDownloadQRIS}
                className="w-full justify-center text-xs font-bold"
              >
                <Download className="w-3.5 h-3.5 text-terracotta-500" />
                Unduh Gambar QRIS ke Galeri
              </Button>
              <p className="text-[11px] text-earth-700">
                Gunakan fitur scan dari galeri foto pada aplikasi m-Banking Anda.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="pt-6 border-t border-earth-200 flex items-center justify-between">
        <Button type="button" variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Rincian Tugas
        </Button>

        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={onNext}
          className="font-bold shadow-warm"
        >
          Saya Sudah Bayar, Lanjut Upload Bukti
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
