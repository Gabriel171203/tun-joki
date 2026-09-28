"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { OrderFormData, OrderCalculation } from "@/types/order";
import { validateImageFile } from "@/lib/validations/order";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  UploadCloud,
  FileImage,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  Trash2,
} from "lucide-react";

interface StepProofUploadProps {
  formData: OrderFormData;
  setFormData: React.Dispatch<React.SetStateAction<OrderFormData>>;
  pricing: OrderCalculation;
  onBack: () => void;
  onSubmit: (proofFile: File) => Promise<void>;
  isSubmitting: boolean;
}

export function StepProofUpload({
  setFormData,
  pricing,
  onBack,
  onSubmit,
  isSubmitting,
}: StepProofUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    acceptProofFile(file);
  };

  const acceptProofFile = (file: File) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || "File tidak valid");
      return;
    }

    setError(null);
    setSelectedFile(file);
    setFormData((prev) => ({ ...prev, payment_proof: file }));

    // Create instant local preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) acceptProofFile(file);
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFormData((prev) => ({ ...prev, payment_proof: null, payment_proof_url: undefined }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmitForm = async () => {
    if (!selectedFile) {
      setError("Silakan pilih dan unggah foto bukti transfer QRIS Anda terlebih dahulu.");
      return;
    }
    setError(null);
    await onSubmit(selectedFile);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-navy-950">
          Langkah 3: Unggah Bukti Pembayaran QRIS
        </h2>
        <p className="text-xs sm:text-sm text-earth-700 mt-1">
          Unggah screenshot atau foto struk pembayaran DP sebesar <strong>{formatRupiah(pricing.dpAmount)}</strong> untuk verifikasi instan admin.
        </p>
      </div>

      {/* Upload Zone & Preview Box */}
      <div className="max-w-xl mx-auto space-y-6">
        {!previewUrl ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            role="button"
            tabIndex={0}
            aria-label="Unggah foto bukti transfer"
            className="border-2 border-dashed border-earth-500 hover:border-terracotta-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 focus-visible:ring-offset-2 bg-white rounded-3xl p-10 text-center cursor-pointer transition-all hover:shadow-warm space-y-4"
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/webp,image/jpg"
              className="hidden"
            />
            <div className="w-16 h-16 rounded-3xl bg-terracotta-50 text-terracotta-600 flex items-center justify-center mx-auto shadow-sm">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-bold text-navy-950">
                Pilih atau Seret Foto Bukti Transfer ke Sini
              </h4>
              <p className="text-xs text-earth-600 mt-1">
                Format yang diterima: JPG, PNG, atau WEBP (Maksimal 5 MB)
              </p>
            </div>
            <div className="pt-2">
              <Button type="button" variant="secondary" size="sm" className="text-xs font-semibold">
                <FileImage className="w-3.5 h-3.5 text-terracotta-500" />
                Jelajahi Galeri / Dokumen
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border-2 border-emerald-500/80 p-6 shadow-warm space-y-4 text-center">
            <div className="flex items-center justify-between pb-3 border-b border-earth-100 text-xs font-bold text-emerald-800">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Bukti Pembayaran Terpilih
              </span>
              <button
                type="button"
                onClick={handleRemove}
                disabled={isSubmitting}
                className="text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors min-h-[44px] px-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus & Ganti
              </button>
            </div>

            {/* Preview Container */}
            <div className="relative w-full h-80 rounded-2xl overflow-hidden bg-earth-100 border border-earth-200">
              <Image
                src={previewUrl}
                alt="Preview Bukti Pembayaran"
                fill
                className="object-contain"
              />
            </div>

            <div className="text-xs text-earth-600">
              <span className="font-semibold text-navy-950">{selectedFile?.name}</span> (
              {((selectedFile?.size || 0) / 1024 / 1024).toFixed(2)} MB)
            </div>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Security & Privacy Assurance */}
        <div className="p-4 rounded-2xl bg-earth-100/70 border border-earth-200 text-xs text-earth-700 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-navy-950">Nama Berkas Diacak Otomatis (UUID)</p>
            <p className="text-[11px] text-earth-600 mt-0.5">
              Berkas disimpan dengan nama acak (UUID), bukan nama asli Anda, dan tautannya tidak kami sebarkan. Orang yang berhasil memperoleh tautannya tetap bisa membuka berkas ini.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="pt-6 border-t border-earth-200 flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          disabled={isSubmitting}
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Kode QRIS
        </Button>

        <Button
          type="button"
          variant="emerald"
          size="lg"
          onClick={handleSubmitForm}
          isLoading={isSubmitting}
          className="font-bold shadow-warm-lg"
        >
          <Image src="/whatsapp-logo-white.png" alt="" aria-hidden width={20} height={20} className="w-4 h-4" />
          Kirim Pesanan & Lanjut ke WhatsApp
        </Button>
      </div>
    </div>
  );
}
