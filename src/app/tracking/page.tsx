"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { OrderRecord, OrderStatus } from "@/types/order";
import { getOrderByCode } from "@/lib/orders-store";
import { formatRupiah, cleanPhoneNumber } from "@/lib/utils";
import { SITE_CONFIG, SERVICE_CATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Search,
  CheckCircle2,
  Info,
  FileCheck,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

function TrackingContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") || "";

  const [searchCode, setSearchCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [searched, setSearched] = useState(false);
  const [searchError, setSearchError] = useState<"not_found" | "server" | null>(null);

  const handleSearch = async (codeToFind?: string) => {
    const code = (codeToFind || searchCode).trim();
    if (!code) return;

    setLoading(true);
    setSearched(true);
    setSearchError(null);
    try {
      const result = await getOrderByCode(code);
      setOrder(result);
      if (!result) setSearchError("not_found");
    } catch (e) {
      console.error(e);
      setOrder(null);
      setSearchError("server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCode) {
      handleSearch(initialCode);
    }
  }, [initialCode]);

  const waNumber = cleanPhoneNumber(SITE_CONFIG.adminWhatsapp);

  const getStatusStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case "pending_verification":
        return 0;
      case "in_progress":
        return 1;
      case "review_ready":
        return 2;
      case "revision":
        return 2;
      case "completed":
        return 3;
      default:
        return 0;
    }
  };

  const statusSteps = [
    { title: "Verifikasi Pembayaran", desc: "Admin memeriksa bukti transfer QRIS Anda." },
    { title: "Sedang Dikerjakan", desc: "Tim spesialis sedang mengerjakan tugas sesuai modul." },
    { title: "Review & Quality Check", desc: "Pengecekan hasil, formatting, dan lolos uji Turnitin/AI." },
    { title: "Selesai & Serah Terima", desc: "Tugas tuntas, file lengkap siap dikirim ke WhatsApp." },
  ];

  const currentStepIdx = order ? getStatusStepIndex(order.status) : 0;
  const categoryTitle =
    order && SERVICE_CATEGORIES.find((c) => c.id === order.service_category)?.title;

  return (
    <div className="py-12 md:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center space-y-4 mb-10">
        <h1 className="text-3xl sm:text-4xl font-black text-navy-950 tracking-tight">
          Cek Status Pengerjaan Tugas
        </h1>
        <p className="text-sm sm:text-base text-earth-700 max-w-xl mx-auto">
          Pantau sejauh mana tugas Anda telah diproses oleh tim kami secara transparan.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white rounded-3xl border-2 border-earth-200/80 p-4 sm:p-5 shadow-warm mb-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="Masukkan Kode Pesanan (Contoh: TS-2026-X89K atau TS-2026-DEMO)"
              className="w-full px-4 py-3.5 min-h-[44px] rounded-2xl border border-earth-500 bg-earth-50/50 text-sm font-semibold uppercase tracking-wider text-navy-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 placeholder:normal-case placeholder:font-normal placeholder:text-earth-500"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={loading}
            className="font-bold sm:w-44 shadow-warm"
          >
            <Search className="w-4 h-4" />
            Lacak Pesanan
          </Button>
        </form>
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-earth-700 px-1 gap-3">
          <span>* Format kode pesanan tertera di nota atau chat WA admin.</span>
          <button
            type="button"
            onClick={() => {
              setSearchCode("TS-2026-DEMO");
              handleSearch("TS-2026-DEMO");
            }}
            className="text-terracotta-600 font-semibold hover:underline"
          >
            Coba demo tracking
          </button>
        </div>
      </div>

      {/* Results Section */}
      {order ? (
        <div className="space-y-8 bg-white rounded-3xl border-2 border-earth-200/80 p-6 sm:p-10 shadow-warm">
          {/* Top Order Meta */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-earth-200">
            <div>
              <span className="text-xs font-bold text-earth-700">
                Kode Pesanan:
              </span>
              <h2 className="text-2xl font-black text-navy-950 font-mono">
                {order.order_code}
              </h2>
              <p className="text-xs text-earth-600 mt-0.5">
                Dibuat pada: {new Date(order.created_at).toLocaleDateString("id-ID", { dateStyle: "full" })}
              </p>
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {order.status === "pending_verification"
                  ? "Menunggu Konfirmasi Bukti QRIS"
                  : order.status === "in_progress"
                  ? "Tugas Sedang Dikerjakan"
                  : order.status === "review_ready"
                  ? "Draft Siap Direview"
                  : order.status === "revision"
                  ? "Proses Revisi Berjalan"
                  : "Pesanan Tuntas Selesai"}
              </span>
            </div>
          </div>

          {/* Stepper Visual Tracker */}
          <div className="py-4">
            <h3 className="text-xs font-bold text-earth-700 mb-6">
              Progres Pengerjaan:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
              {statusSteps.map((step, idx) => {
                const isPassed = currentStepIdx > idx;
                const isCurrent = currentStepIdx === idx;

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border-2 transition-all ${
                      isCurrent
                        ? "border-terracotta-500 bg-terracotta-50/70 shadow-sm"
                        : isPassed
                        ? "border-emerald-500 bg-emerald-50/50"
                        : "border-earth-200 bg-earth-50/30 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                          isPassed
                            ? "bg-emerald-600 text-white"
                            : isCurrent
                            ? "bg-terracotta-500 text-white"
                            : "bg-earth-200 text-earth-700"
                        }`}
                      >
                        {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <span className="text-xs font-bold text-navy-950">{step.title}</span>
                    </div>
                    <p className="text-[11px] text-earth-600 leading-snug">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Admin Note Banner if any */}
          {order.admin_notes && (
            <div className="p-4 rounded-2xl bg-earth-100/80 border border-earth-300 flex items-start gap-3">
              <Info className="w-5 h-5 text-terracotta-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-navy-950">Catatan dari Tim Pengerjaan:</p>
                <p className="text-xs text-earth-700 mt-0.5">{order.admin_notes}</p>
              </div>
            </div>
          )}

          {/* Order Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-earth-200 text-xs">
            <div className="space-y-3">
              <h4 className="font-bold text-earth-700">
                Informasi Tugas:
              </h4>
              <div className="space-y-2 text-earth-800">
                <div>
                  <span className="text-earth-700 block">Kategori Layanan:</span>
                  <span className="font-bold">{categoryTitle || order.service_category}</span>
                </div>
                <div>
                  <span className="text-earth-500 block">Judul / Topik Tugas:</span>
                  <span className="font-bold">{order.task_title}</span>
                </div>
                <div>
                  <span className="text-earth-500 block">Batas Deadline:</span>
                  <span className="font-bold text-terracotta-600">
                    {new Date(order.deadline_date).toLocaleString("id-ID", {
                      dateStyle: "full",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
                {order.task_file_name && (
                  <div>
                    <span className="text-earth-500 block">Berkas Tugas:</span>
                    <span className="font-semibold text-emerald-800 flex items-center gap-1">
                      <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                      {order.task_file_name}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-earth-700">
                Informasi Pembayaran:
              </h4>
              <div className="space-y-2 text-earth-800">
                <div>
                  <span className="text-earth-500 block">Total Biaya:</span>
                  <span className="font-bold text-navy-950">
                    {formatRupiah(order.estimated_price)}
                  </span>
                </div>
                <div>
                  <span className="text-earth-500 block">Uang Muka (DP 50%):</span>
                  <span className="font-bold text-emerald-700">
                    {formatRupiah(order.dp_amount)} (Terbayar)
                  </span>
                </div>
                <div>
                  <span className="text-earth-500 block">Sisa Pelunasan:</span>
                  <span className="font-bold text-earth-600">
                    {formatRupiah(order.estimated_price - order.dp_amount)} (Saat draft disetujui)
                  </span>
                </div>
                {order.payment_proof_url && (
                  <div className="pt-2">
                    <span className="text-earth-500 block mb-1">Bukti Transfer:</span>
                    <a
                      href={order.payment_proof_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-terracotta-600 hover:text-terracotta-700 font-semibold flex items-center gap-1 text-xs"
                    >
                      Lihat Foto Bukti Pembayaran <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Direct WhatsApp Follow-up */}
          <div className="pt-6 border-t border-earth-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-earth-600 text-center sm:text-left">
              Ada pertanyaan atau instruksi tambahan untuk tugas ini?
            </div>
            <a
              href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                `Halo Admin Tuntasin, saya ingin menanyakan progres pesanan dengan kode: ${order.order_code}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button variant="emerald" size="md" className="w-full sm:w-auto font-bold text-xs">
                <Image src="/whatsapp-logo-white.png" alt="" aria-hidden width={20} height={20} className="w-4 h-4" />
                Chat Admin via WhatsApp
              </Button>
            </a>
          </div>
        </div>
      ) : searched && !loading && searchError === "server" ? (
        <div role="alert" className="text-center py-12 bg-white rounded-3xl border-2 border-red-200 p-8 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-navy-950">Gagal Memuat Data</h3>
          <p className="text-xs sm:text-sm text-earth-600 max-w-md mx-auto">
            Terjadi gangguan saat mengambil data pesanan. Silakan coba beberapa saat lagi atau hubungi admin via WhatsApp.
          </p>
          <div className="pt-2">
            <Button variant="primary" size="sm" className="font-semibold text-xs" onClick={() => handleSearch()}>
              Coba Lagi
            </Button>
          </div>
        </div>
      ) : searched && !loading && searchError === "not_found" ? (
        <div className="text-center py-12 bg-white rounded-3xl border-2 border-earth-200 p-8 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-earth-100 text-earth-700 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-navy-950">Pesanan Tidak Ditemukan</h3>
          <p className="text-xs sm:text-sm text-earth-600 max-w-md mx-auto">
            Kode pesanan &ldquo;{searchCode}&rdquo; tidak terdaftar di sistem kami. Pastikan format kode sudah benar atau hubungi admin via WhatsApp untuk bantuan.
          </p>
          <div className="pt-2">
            <a
              href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                `Halo Admin Tuntasin, saya mencari pesanan dengan kode ${searchCode} tapi tidak ditemukan di website...`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="secondary" size="sm" className="font-semibold text-xs">
                <Image src="/whatsapp-logo.png" alt="" aria-hidden width={20} height={20} className="w-3.5 h-3.5" />
                Bantuan Admin via WhatsApp
              </Button>
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-terracotta-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-earth-700">Memuat Data Pelacakan...</p>
          </div>
        </div>
      }
    >
      <TrackingContent />
    </Suspense>
  );
}
