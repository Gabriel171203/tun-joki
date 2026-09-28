"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { OrderFormData, TaskDifficulty, EducationLevel } from "@/types/order";
import { SERVICE_CATEGORIES, DIFFICULTY_RATES } from "@/lib/constants";
import { validateTaskFile } from "@/lib/validations/order";
import { Button } from "@/components/ui/button";
import {
  UploadCloud,
  FileCheck,
  AlertCircle,
  ArrowRight,
  Shield,
  Info,
} from "lucide-react";

interface StepTaskDetailsProps {
  formData: OrderFormData;
  setFormData: React.Dispatch<React.SetStateAction<OrderFormData>>;
  onNext: () => void;
  onConsultation?: () => void;
  isSubmitting?: boolean;
}

export function StepTaskDetails({
  formData,
  setFormData,
  onNext,
  onConsultation,
  isSubmitting = false,
}: StepTaskDetailsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const realNameRef = useRef<string>("");
  const [fileError, setFileError] = React.useState<string | null>(null);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});

  const currentCategoryConfig =
    SERVICE_CATEGORIES.find((c) => c.id === formData.service_category) || SERVICE_CATEGORIES[0];
  const isConsultationFlow = currentCategoryConfig.flowType === "consultation";

  const handleAnonymousToggle = (checked: boolean) => {
    if (checked) {
      const currentName = formData.client_name.trim();
      if (currentName && !currentName.startsWith("Mahasiswa_")) {
        realNameRef.current = currentName;
      }
      const randomAlias = `Mahasiswa_${Math.floor(1000 + Math.random() * 9000)}`;
      setFormData((prev) => ({
        ...prev,
        is_anonymous: true,
        client_name: randomAlias,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        is_anonymous: false,
        client_name: realNameRef.current,
      }));
      realNameRef.current = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    acceptTaskFile(file);
  };

  const acceptTaskFile = (file: File) => {
    const validation = validateTaskFile(file);
    if (!validation.valid) {
      setFileError(validation.error || "Berkas tidak valid");
      return;
    }

    setFileError(null);
    setFormData((prev) => ({
      ...prev,
      task_file: file,
      task_file_name: file.name,
    }));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) acceptTaskFile(file);
  };

  const validateAndProceed = () => {
    const errors: Record<string, string> = {};

    if (!formData.client_name.trim()) {
      errors.client_name = "Nama atau alias pemesan wajib diisi";
    }
    if (!formData.whatsapp.trim() || formData.whatsapp.length < 9) {
      errors.whatsapp = "Nomor WhatsApp aktif wajib diisi (minimal 9 digit)";
    }
    if (formData.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Format email tidak valid";
    }
    if (!formData.task_title.trim() || formData.task_title.length < 3) {
      errors.task_title = "Judul/topik tugas wajib diisi (minimal 3 karakter)";
    }
    if (!formData.deadline_date) {
      errors.deadline_date = "Tentukan tanggal batas deadline";
    }
    if (!formData.deadline_time) {
      errors.deadline_time = "Tentukan jam batas deadline";
    }
    if (!formData.task_description.trim() || formData.task_description.length < 10) {
      errors.task_description = "Berikan detail instruksi atau catatan tugas (minimal 10 karakter)";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      window.scrollTo({ top: 150, behavior: "smooth" });
      return;
    }

    setFormErrors({});

    if (isConsultationFlow && onConsultation) {
      onConsultation();
    } else {
      onNext();
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-navy-950">
          Langkah 1: Rincian & Spesifikasi Tugas
        </h2>
        <p className="text-xs sm:text-sm text-earth-700 mt-1">
          Lengkapi data tugas dengan detail agar tim dapat langsung menganalisis dan mengerjakannya secara tepat sasaran.
        </p>
      </div>

      {/* Anonymous Toggle Banner */}
      <div className="p-4 rounded-2xl bg-earth-100/70 border border-earth-300/60 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-earth-200 text-earth-800 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-terracotta-600" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-navy-950">
              Pesan Secara Anonim (Tanpa Nama Asli)
            </h4>
            <p className="text-[11px] text-earth-700">
              Nama asli dan kampus Anda tidak akan kami tanyakan maupun disimpan.
            </p>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={formData.is_anonymous}
            onChange={(e) => handleAnonymousToggle(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-earth-500 peer-focus:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-terracotta-500 peer-focus-visible:ring-offset-2 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-earth-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
        </label>
      </div>

      {/* Notice Banner for Coding / Academic Thesis */}
      {isConsultationFlow && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/90 flex items-start gap-3 text-xs text-emerald-900">
          <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold text-emerald-950">
              Alur Konsultasi Langsung (Khusus IT/Coding & Karya Ilmiah):
            </p>
            <p className="text-emerald-800 leading-relaxed">
              Tugas pemrograman dan skripsi memiliki kerumitan yang bervariasi. Setelah mengisi data di bawah, rincian soal akan otomatis terhubung ke WhatsApp Admin untuk penentuan harga yang pas dan adil. Anda <strong>belum perlu membayar DP sekarang</strong>.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Nama / Alias */}
        <div>
          <label className="block text-xs font-bold text-navy-950 mb-1.5">
            {formData.is_anonymous ? "Nama Alias (Otomatis)" : "Nama Lengkap / Panggilan *"}
          </label>
          <input
            type="text"
            value={formData.client_name}
            onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
            placeholder="Contoh: Dimas Aditya / Anonim"
            className={`w-full px-4 py-2.5 rounded-xl border bg-white text-sm text-navy-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 ${
              formErrors.client_name ? "border-red-500 bg-red-50/20" : "border-earth-500"
            }`}
          />
          {formErrors.client_name && (
            <p className="text-[11px] text-red-600 mt-1">{formErrors.client_name}</p>
          )}
        </div>

        {/* WhatsApp */}
        <div>
          <label className="block text-xs font-bold text-navy-950 mb-1.5">
            Nomor WhatsApp Aktif *
          </label>
          <input
            type="tel"
            value={formData.whatsapp}
            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
            placeholder="08123456789 atau 628123456789"
            className={`w-full px-4 py-2.5 rounded-xl border bg-white text-sm text-navy-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 ${
              formErrors.whatsapp ? "border-red-500 bg-red-50/20" : "border-earth-500"
            }`}
          />
          {formErrors.whatsapp && (
            <p className="text-[11px] text-red-600 mt-1">{formErrors.whatsapp}</p>
          )}
          <p className="text-[10px] text-earth-700 mt-1">
            Digunakan untuk konfirmasi pesanan dan update progres pengerjaan.
          </p>
        </div>

        {/* Email (Opsional) */}
        <div>
          <label className="block text-xs font-bold text-navy-950 mb-1.5">
            Email (Opsional)
          </label>
          <input
            type="email"
            value={formData.email || ""}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="emailanda@gmail.com"
            className={`w-full px-4 py-2.5 rounded-xl border bg-white text-sm text-navy-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 ${
              formErrors.email ? "border-red-500 bg-red-50/20" : "border-earth-500"
            }`}
          />
          {formErrors.email && (
            <p className="text-[11px] text-red-600 mt-1">{formErrors.email}</p>
          )}
          <p className="text-[10px] text-earth-700 mt-1">
            Diisi = Anda dapat email konfirmasi saat pesanan disetujui admin.
          </p>
        </div>

        {/* Jenjang Pendidikan */}
        <div>
          <label className="block text-xs font-bold text-navy-950 mb-1.5">
            Jenjang Pendidikan *
          </label>
          <select
            value={formData.education_level}
            onChange={(e) =>
              setFormData({ ...formData, education_level: e.target.value as EducationLevel })
            }
            className="w-full px-4 py-2.5 min-h-[44px] rounded-xl border border-earth-500 bg-white text-sm text-navy-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500"
          >
            <option value="S1">S1 (Sarjana / Perkuliahan)</option>
            <option value="D3">D3 (Diploma)</option>
            <option value="S2">S2 (Magister / Pascasarjana)</option>
            <option value="SMA/SMK">SMA / SMK</option>
            <option value="Umum">Umum / Profesional</option>
          </select>
        </div>
      </div>

      {/* Kategori Layanan */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-navy-950">
          Kategori Layanan Tugas *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SERVICE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFormData({ ...formData, service_category: cat.id })}
              className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                formData.service_category === cat.id
                  ? "border-terracotta-500 bg-terracotta-50/80 shadow-sm"
                  : "border-earth-200 bg-earth-50/40 hover:bg-earth-100"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-bold text-navy-950">{cat.title}</p>
                <span
                  className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                    cat.flowType === "consultation"
                      ? "bg-terracotta-100 text-terracotta-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {cat.flowType === "consultation" ? "Via WA" : "QRIS"}
                </span>
              </div>
              <p className="text-[11px] text-earth-600 line-clamp-2">{cat.shortDesc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Judul Tugas */}
      <div>
        <label className="block text-xs font-bold text-navy-950 mb-1.5">
          Judul / Topik Tugas *
        </label>
        <input
          type="text"
          value={formData.task_title}
          onChange={(e) => setFormData({ ...formData, task_title: e.target.value })}
          placeholder="Contoh: Pembuatan Web E-Commerce Laravel / Makalah Etika Bisnis Bab 1-3 / Slide Presentasi PPT"
          className={`w-full px-4 py-2.5 rounded-xl border bg-white text-sm text-navy-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 ${
            formErrors.task_title ? "border-red-500 bg-red-50/20" : "border-earth-500"
          }`}
        />
        {formErrors.task_title && (
          <p className="text-[11px] text-red-600 mt-1">{formErrors.task_title}</p>
        )}
      </div>

      {/* Deadline Date & Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-navy-950 mb-1.5">
            Tanggal Deadline Pengumpulan *
          </label>
          <input
            type="date"
            value={formData.deadline_date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setFormData({ ...formData, deadline_date: e.target.value })}
            className={`w-full px-4 py-2.5 rounded-xl border bg-white text-sm text-navy-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 ${
              formErrors.deadline_date ? "border-red-500 bg-red-50/20" : "border-earth-500"
            }`}
          />
          {formErrors.deadline_date && (
            <p className="text-[11px] text-red-600 mt-1">{formErrors.deadline_date}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-navy-950 mb-1.5">
            Jam Batas Pengumpulan (WIB) *
          </label>
          <input
            type="time"
            value={formData.deadline_time}
            onChange={(e) => setFormData({ ...formData, deadline_time: e.target.value })}
            className={`w-full px-4 py-2.5 rounded-xl border bg-white text-sm text-navy-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 ${
              formErrors.deadline_time ? "border-red-500 bg-red-50/20" : "border-earth-500"
            }`}
          />
          {formErrors.deadline_time && (
            <p className="text-[11px] text-red-600 mt-1">{formErrors.deadline_time}</p>
          )}
        </div>
      </div>

      {/* Tingkat Kesulitan */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-navy-950">
          Perkiraan Tingkat Kerumitan Tugas *
        </label>
        <div className="grid grid-cols-3 gap-2.5">
          {(Object.keys(DIFFICULTY_RATES) as TaskDifficulty[]).map((diffKey) => {
            const diff = DIFFICULTY_RATES[diffKey];
            const isSelected = formData.difficulty === diffKey;
            return (
              <button
                key={diffKey}
                type="button"
                onClick={() => setFormData({ ...formData, difficulty: diffKey })}
                className={`p-3 rounded-2xl border-2 text-center transition-all ${
                  isSelected
                    ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-sm"
                    : "border-earth-200 bg-white text-earth-800 hover:bg-earth-50"
                }`}
              >
                <span className="text-xs">{diff.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Deskripsi & Instruksi Dosen */}
      <div>
        <label className="block text-xs font-bold text-navy-950 mb-1.5">
          Deskripsi, Instruksi Dosen & Kebutuhan Khusus *
        </label>
        <textarea
          rows={4}
          value={formData.task_description}
          onChange={(e) => setFormData({ ...formData, task_description: e.target.value })}
          placeholder="Tuliskan petunjuk lengkap: contoh bahasa pemrograman yang diwajibkan dosen, jumlah kata/halaman, format sitasi (APA/IEEE), atau poin-poin yang wajib ada..."
          className={`w-full px-4 py-3 min-h-[44px] rounded-xl border bg-white text-sm text-navy-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 leading-relaxed ${
            formErrors.task_description ? "border-red-500 bg-red-50/20" : "border-earth-500"
          }`}
        />
        {formErrors.task_description && (
          <p className="text-[11px] text-red-600 mt-1">{formErrors.task_description}</p>
        )}
      </div>

      {/* Upload File Tugas/Soal */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-navy-950">
          Unggah Berkas Tugas / Modul / Soal (Opsional)
        </label>
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
          aria-label="Unggah berkas tugas"
          className="border-2 border-dashed border-earth-500 hover:border-terracotta-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 focus-visible:ring-offset-2 bg-white/70 hover:bg-white rounded-2xl p-6 text-center cursor-pointer transition-all space-y-2"
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.rar,.txt,image/*"
            className="hidden"
          />
          <div className="w-12 h-12 rounded-2xl bg-earth-100 text-earth-700 flex items-center justify-center mx-auto">
            <UploadCloud className="w-6 h-6 text-terracotta-600" />
          </div>
          {formData.task_file ? (
            <div className="flex items-center justify-center gap-2 text-sm font-bold text-emerald-800">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>{formData.task_file.name}</span>
              <span className="text-xs text-earth-700 font-normal">
                ({(formData.task_file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
          ) : (
            <div>
              <p className="text-xs font-bold text-navy-950">
                Klik untuk memilih berkas soal / modul panduan
              </p>
              <p className="text-[11px] text-earth-700 mt-0.5">
                Mendukung PDF, Word, PowerPoint, ZIP, RAR, atau Gambar (Maks 25MB)
              </p>
            </div>
          )}
        </div>
        {fileError && (
          <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {fileError}
          </p>
        )}
        <p className="text-[10px] text-earth-700 flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 shrink-0 mt-px" aria-hidden="true" />
          <span>
            Catatan: Anda juga dapat mengirimkan berkas langsung lewat chat WhatsApp nanti saat
            berdiskusi dengan admin.
          </span>
        </p>
      </div>

      {/* Action Next */}
      <div className="pt-4 border-t border-earth-200 flex justify-end">
        {isConsultationFlow ? (
          <Button
            type="button"
            onClick={validateAndProceed}
            size="lg"
            variant="emerald"
            isLoading={isSubmitting}
            className="font-bold shadow-warm w-full sm:w-auto"
          >
            <Image src="/whatsapp-logo-white.png" alt="" aria-hidden width={20} height={20} className="w-4 h-4" />
            Kirim Brief & Konsultasi ke WhatsApp Admin
          </Button>
        ) : (
          <Button
            type="button"
            onClick={validateAndProceed}
            size="lg"
            variant="primary"
            className="font-bold shadow-warm w-full sm:w-auto"
          >
            Lanjut ke Ringkasan & Pembayaran QRIS
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
