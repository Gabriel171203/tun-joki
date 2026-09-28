"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import confetti from "canvas-confetti";
import { OrderRecord } from "@/types/order";
import { createWhatsAppOrderLink, createWhatsAppConsultationLink, formatRupiah } from "@/lib/utils";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Copy,
  Check,
  Search,
  ExternalLink,
} from "lucide-react";

interface StepSuccessWhatsAppProps {
  order: OrderRecord;
}

export function StepSuccessWhatsApp({ order }: StepSuccessWhatsAppProps) {
  const [copiedCode, setCopiedCode] = useState(false);

  const isConsultation = !order.payment_proof_url;

  const waUrl = isConsultation
    ? createWhatsAppConsultationLink({
        client_name: order.client_name,
        is_anonymous: order.is_anonymous,
        education_level: order.education_level,
        service_category: order.service_category,
        task_title: order.task_title,
        task_description: order.task_description,
        deadline_date: order.deadline_date,
        task_file_url: order.task_file_url,
      })
    : createWhatsAppOrderLink(order);

  const categoryName =
    SERVICE_CATEGORIES.find((c) => c.id === order.service_category)?.title || order.service_category;

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#B8507F", "#7D6572", "#E39EC2", "#C9AADD"],
      });
    } catch {
      // ignore
    }

    const timer = setTimeout(() => {
      window.open(waUrl, "_blank", "noopener,noreferrer");
    }, 1200);

    return () => clearTimeout(timer);
  }, [waUrl]);

  const handleCopyCode = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(order.order_code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center space-y-8 py-6">
      {/* Success Badge */}
      <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-warm">
        <CheckCircle className="w-10 h-10" />
      </div>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <CheckCircle className="w-3.5 h-3.5" />
          {isConsultation ? "Brief Konsultasi Berhasil Disiapkan!" : "Pesanan & Bukti Bayar Berhasil Dikirim!"}
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-navy-950">
          {isConsultation ? "Lanjut Diskusi dengan Admin via WhatsApp" : "Satu Langkah Lagi Menuju Pengerjaan"}
        </h2>
        <p className="text-xs sm:text-sm text-earth-700 max-w-lg mx-auto leading-relaxed">
          {isConsultation
            ? "Data rincian tugas Anda telah tercatat aman. Silakan klik tombol di bawah untuk langsung berdiskusi dengan admin mengenai modul soal dan kesepakatan harga."
            : "Pesanan Anda telah tercatat dengan aman. Silakan klik tombol di bawah untuk membuka chat WhatsApp dengan admin dan memverifikasi pembayaran."}
        </p>
      </div>

      {/* Unique Order Code Box */}
      <div className="p-5 rounded-3xl bg-earth-50 border-2 border-earth-400 max-w-md mx-auto space-y-2">
        <span className="text-[11px] font-bold text-earth-700 block">
          Kode Pelacakan Pesanan Anda:
        </span>
        <div className="flex items-center justify-center gap-3">
          <span className="text-2xl font-black tracking-wider text-navy-950 font-mono">
            {order.order_code}
          </span>
          <button
            type="button"
            onClick={handleCopyCode}
            className="p-2.5 min-h-[44px] min-w-[44px] rounded-xl bg-white border border-earth-500 text-earth-700 hover:text-terracotta-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500"
            title="Salin Kode Pesanan"
          >
            {copiedCode ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="text-[11px] text-earth-700">
          Simpan kode ini untuk memantau status pengerjaan tugas di menu Pelacakan.
        </p>
      </div>

      {/* Main WhatsApp Direct Button */}
      <div className="space-y-3 pt-2">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block w-full sm:w-auto"
        >
          <Button
            size="lg"
            variant="emerald"
            className="w-full sm:w-auto px-10 py-4 text-base font-extrabold shadow-warm-lg"
          >
            <Image src="/whatsapp-logo-white.png" alt="" aria-hidden width={20} height={20} className="w-5 h-5" />
            {isConsultation ? "Buka Chat WhatsApp & Bahas Soal Sekarang" : "Buka Obrolan WhatsApp Admin Sekarang"}
            <ExternalLink className="w-4 h-4 ml-1" />
          </Button>
        </a>

        <p className="text-xs text-earth-600 italic">
          * Jika WhatsApp tidak terbuka otomatis karena diblokir browser, klik tombol hijau di atas.
        </p>
      </div>

      {/* Summary Recap Details */}
      <div className="text-left bg-white rounded-3xl border border-earth-200 p-6 space-y-3 text-xs">
        <h4 className="font-bold text-navy-950 text-[11px] pb-2 border-b border-earth-100">
          Rincian yang Dikirimkan ke Admin:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-earth-700">
          <div>
            <strong>Kategori:</strong> {categoryName}
          </div>
          <div>
            <strong>Judul:</strong> {order.task_title}
          </div>
          <div>
            <strong>Deadline:</strong> {new Date(order.deadline_date).toLocaleDateString("id-ID")}
          </div>
          <div>
            <strong>Status Biaya:</strong>{" "}
            {isConsultation ? (
              <span className="text-terracotta-600 font-bold">Diskusi Langsung di WA</span>
            ) : (
              <span className="text-emerald-700 font-bold">DP {formatRupiah(order.dp_amount)} (QRIS)</span>
            )}
          </div>
          <div className="sm:col-span-2">
            <strong>Berkas Tugas:</strong>{" "}
            <span className="text-earth-800">
              {order.task_file_url ? "Tautan Berkas Terlampir di Chat" : "Akan dikirimkan via WA"}
            </span>
          </div>
        </div>
      </div>

      {/* Next Actions */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link href={`/tracking?code=${order.order_code}`}>
          <Button variant="secondary" size="md" className="font-semibold text-xs">
            <Search className="w-4 h-4 text-terracotta-500" />
            Pantau Progres di Halaman Tracking
          </Button>
        </Link>
        <Link href="/">
          <Button variant="ghost" size="md" className="text-xs">
            Kembali ke Beranda
          </Button>
        </Link>
      </div>
    </div>
  );
}
