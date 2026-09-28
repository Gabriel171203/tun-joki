import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { FeedbackForm } from "@/components/feedback/feedback-form";

export const metadata = {
  title: "Kritik & Saran - Tuntasin",
  description:
    "Sampaikan kritik, saran, atau laporan bug tentang website Tuntasin. Masukan dibaca langsung oleh admin.",
};

export default function FeedbackPage() {
  return (
    <div className="py-12 md:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="space-y-3">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-2 -ml-2 text-xs">
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Beranda
          </Button>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black text-navy-950 tracking-tight">
          Kritik & Saran
        </h1>
        <p className="text-xs sm:text-sm text-earth-600 max-w-2xl leading-relaxed">
          Ada yang keliru, ada fitur yang kurang, atau ada ide perbaikan? Tulis di sini. Masukan
          masuk ke daftar admin dan dibaca langsung, bukan otomatis dibalas oleh sistem.
        </p>
      </div>

      <FeedbackForm />
    </div>
  );
}
