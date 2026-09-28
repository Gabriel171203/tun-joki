"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import { feedbackSchema, type FeedbackCategory } from "@/lib/validations/feedback";

const CATEGORIES: { value: FeedbackCategory; label: string }[] = [
  { value: "saran", label: "Saran" },
  { value: "kritik", label: "Kritik" },
  { value: "bug", label: "Laporkan Bug" },
  { value: "lainnya", label: "Lainnya" },
];

const INPUT_BASE =
  "w-full min-h-[44px] px-4 py-2.5 rounded-xl border bg-white text-sm text-navy-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 focus-visible:ring-offset-2 transition-colors";
const LABEL_BASE = "block text-xs font-bold text-navy-950 mb-1.5";
const ERROR_TEXT = "text-[11px] text-red-600 mt-1 flex items-start gap-1";

type FormState = {
  category: FeedbackCategory | "";
  name: string;
  email: string;
  message: string;
};

const EMPTY_FORM: FormState = { category: "", name: "", email: "", message: "" };

const FIELD_IDS: Record<string, string> = {
  category: "feedback-category-saran",
  name: "feedback-name",
  email: "feedback-email",
  message: "feedback-message",
};

export function FeedbackForm() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);

  // Fokus dipindahkan setelah panel sukses dirender, bukan saat setState:
  // ref-nya masih null sebelum render berikutnya.
  useEffect(() => {
    if (isSent) successRef.current?.focus();
  }, [isSent]);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsed = feedbackSchema.safeParse({
      category: form.category,
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
      page_source: typeof window !== "undefined" ? window.location.pathname : undefined,
    });

    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = String(issue.path[0]);
        if (!errors[field]) errors[field] = issue.message;
      }
      setFieldErrors(errors);
      setSubmitError(null);

      const firstField = ["category", "name", "email", "message"].find((f) => errors[f]);
      if (firstField) {
        const el = document.getElementById(FIELD_IDS[firstField]);
        el?.focus();
        el?.scrollIntoView({ block: "center", behavior: "smooth" });
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = (await res.json().catch(() => null)) as {
        success?: boolean;
        message?: string;
      } | null;

      if (!res.ok || !data?.success) {
        setSubmitError(data?.message || `HTTP ${res.status}`);
        return;
      }

      setIsSent(true);
      setForm(EMPTY_FORM);
      setFieldErrors({});
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitError("Gagal menghubungi server. Coba lagi beberapa saat lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSent) {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="bg-white rounded-3xl border-2 border-emerald-200 p-8 sm:p-12 shadow-warm text-center space-y-4 focus:outline-none"
      >
        <span className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-navy-950">Masukan terkirim</h2>
        <p className="text-sm text-earth-700 max-w-md mx-auto leading-relaxed">
          Terima kasih. Masukan Anda sudah masuk ke daftar dan dibaca langsung oleh admin
          Tuntasin.
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsSent(false);
            setForm(EMPTY_FORM);
          }}
          className="font-bold"
        >
          Kirim masukan lain
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border-2 border-earth-200 p-6 sm:p-10 shadow-warm">
      {submitError && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-2xl border border-red-300 bg-red-50 px-4 py-3.5 text-sm text-red-700"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" aria-hidden="true" />
          <p className="font-medium">{submitError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <fieldset className="m-0 border-0 p-0">
          <legend className={LABEL_BASE}>Jenis masukan</legend>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CATEGORIES.map((c) => (
              <div key={c.value}>
                <input
                  type="radio"
                  id={`feedback-category-${c.value}`}
                  name="feedback-category"
                  value={c.value}
                  checked={form.category === c.value}
                  onChange={() => setField("category", c.value)}
                  aria-describedby={fieldErrors.category ? "feedback-category-error" : undefined}
                  className="peer sr-only"
                />
                <label
                  htmlFor={`feedback-category-${c.value}`}
                  className="flex min-h-[44px] cursor-pointer items-center justify-center rounded-xl border px-3 py-2 text-center text-xs font-bold transition-colors border-earth-500 bg-white text-earth-700 hover:border-terracotta-400 hover:text-terracotta-600 peer-checked:border-terracotta-500 peer-checked:bg-terracotta-50 peer-checked:text-terracotta-700 peer-focus-visible:ring-2 peer-focus-visible:ring-terracotta-500 peer-focus-visible:ring-offset-2"
                >
                  {c.label}
                </label>
              </div>
            ))}
          </div>
          {fieldErrors.category && (
            <p id="feedback-category-error" className={ERROR_TEXT}>
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-px" aria-hidden="true" />
              {fieldErrors.category}
            </p>
          )}
        </fieldset>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="feedback-name" className={LABEL_BASE}>
              Nama <span className="font-medium text-earth-600">(opsional)</span>
            </label>
            <input
              id="feedback-name"
              type="text"
              maxLength={80}
              autoComplete="name"
              placeholder="Nama atau panggilan Anda"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              aria-invalid={fieldErrors.name ? true : undefined}
              aria-describedby={fieldErrors.name ? "feedback-name-error" : undefined}
              className={`${INPUT_BASE} ${
                fieldErrors.name ? "border-red-500 bg-red-50/20" : "border-earth-500"
              }`}
            />
            {fieldErrors.name && (
              <p id="feedback-name-error" className={ERROR_TEXT}>
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-px" aria-hidden="true" />
                {fieldErrors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="feedback-email" className={LABEL_BASE}>
              Email <span className="font-medium text-earth-600">(opsional)</span>
            </label>
            <input
              id="feedback-email"
              type="email"
              maxLength={100}
              autoComplete="email"
              placeholder="email@contoh.com"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              aria-invalid={fieldErrors.email ? true : undefined}
              aria-describedby={fieldErrors.email ? "feedback-email-error" : undefined}
              className={`${INPUT_BASE} ${
                fieldErrors.email ? "border-red-500 bg-red-50/20" : "border-earth-500"
              }`}
            />
            {fieldErrors.email && (
              <p id="feedback-email-error" className={ERROR_TEXT}>
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-px" aria-hidden="true" />
                {fieldErrors.email}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="feedback-message" className={LABEL_BASE}>
            Masukan Anda
          </label>
          <textarea
            id="feedback-message"
            rows={5}
            maxLength={2000}
            placeholder="Tulis kritik, saran, atau laporan bug di sini. Sebutkan halaman atau fiturnya jika ada."
            value={form.message}
            onChange={(e) => setField("message", e.target.value)}
            aria-invalid={fieldErrors.message ? true : undefined}
            aria-describedby={fieldErrors.message ? "feedback-message-error" : undefined}
            className={`${INPUT_BASE} py-3 leading-relaxed resize-y ${
              fieldErrors.message ? "border-red-500 bg-red-50/20" : "border-earth-500"
            }`}
          />
          {fieldErrors.message && (
            <p id="feedback-message-error" className={ERROR_TEXT}>
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-px" aria-hidden="true" />
              {fieldErrors.message}
            </p>
          )}
        </div>

        <div className="pt-4 border-t border-earth-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-[11px] text-earth-600 leading-relaxed sm:max-w-xs">
            Nama dan email diisi hanya jika Anda ingin admin membalas. Tanpa keduanya, masukan
            tetap diterima.
          </p>
          <Button
            type="submit"
            size="lg"
            variant="primary"
            isLoading={isSubmitting}
            className="font-bold shadow-warm w-full sm:w-auto"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
            Kirim Masukan
          </Button>
        </div>
      </form>
    </div>
  );
}
