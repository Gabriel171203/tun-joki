import React from "react";
import Link from "next/link";
import Image from "next/image";
import { HeroSection } from "@/components/landing/hero-section";
import { ServicesSection } from "@/components/landing/services-section";
import { CostCalculator } from "@/components/landing/cost-calculator";
import { FeaturesSection } from "@/components/landing/features-section";
import { WorkflowSection } from "@/components/landing/workflow-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { FaqSection } from "@/components/landing/faq-section";
import { Button } from "@/components/ui/button";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { cleanPhoneNumber } from "@/lib/utils";

export default function HomePage() {
  const waNumber = cleanPhoneNumber(SITE_CONFIG.adminWhatsapp);

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <ServicesSection />
      <CostCalculator />
      <FeaturesSection />
      <WorkflowSection />
      <TestimonialsSection />
      <FaqSection />

      {/* Bottom Conversion Banner */}
      <section className="py-20 bg-navy-950 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7 relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Tugas Menumpuk? Jangan Tunggu Sampai H-1 Jam Pengumpulan!
          </h2>

          <p className="text-base sm:text-lg text-earth-300 max-w-2xl mx-auto leading-relaxed">
            Dapatkan bantuan akademisi dan programmer profesional sekarang. Pembayaran DP aman via QRIS, privasi terjaga, dan revisi tuntas sampai nilai keluar.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/order" className="w-full sm:w-auto">
              <Button size="lg" variant="primary" className="w-full sm:w-auto text-base shadow-warm font-bold">
                Buat Pesanan Baru Sekarang
              </Button>
            </Link>

            <a
              href={`https://wa.me/${waNumber}?text=${encodeURIComponent("Halo Admin Tuntasin, saya mau konsultasi tugas...")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button size="lg" variant="secondary" className="w-full sm:w-auto text-base font-bold bg-white/10 hover:bg-white/20 text-white border-white/20">
                <Image src="/whatsapp-logo-white.png" alt="" aria-hidden width={20} height={20} className="w-5 h-5" />
                Tanya Dulu via WhatsApp
              </Button>
            </a>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-earth-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Identitas Tidak Dipublikasikan
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Garansi Revisi Sepuasnya
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Bebas Plagiasi & Bebas AI
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
