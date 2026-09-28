import React from "react";
import Link from "next/link";
import { SERVICE_CATEGORIES, ServiceCategoryConfig } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code2, BookOpen, Presentation } from "lucide-react";

function getIcon(iconName: string) {
  switch (iconName) {
    case "BookOpen":
      return <BookOpen className="w-5 h-5" />;
    case "Presentation":
      return <Presentation className="w-5 h-5" />;
    default:
      return <Code2 className="w-5 h-5" />;
  }
}

function iconColorClass(color: ServiceCategoryConfig["color"]) {
  if (color === "terracotta") return "text-terracotta-600";
  if (color === "emerald") return "text-emerald-600";
  return "text-navy-700";
}

function badgeVariant(color: ServiceCategoryConfig["color"]) {
  if (color === "terracotta") return "terracotta" as const;
  if (color === "emerald") return "emerald" as const;
  return "navy" as const;
}

function ServiceDetail({ service }: { service: ServiceCategoryConfig }) {
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
        <div className="flex items-center gap-3">
          <span className={iconColorClass(service.color)} aria-hidden="true">
            {getIcon(service.icon)}
          </span>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-navy-950">{service.title}</h3>
            <p className="text-xs font-semibold text-earth-600">{service.subtitle}</p>
          </div>
        </div>
        <Badge variant={badgeVariant(service.color)}>{service.badge}</Badge>
      </div>

      <p className="mt-3 text-sm text-earth-700 leading-relaxed max-w-2xl">{service.shortDesc}</p>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
        <div>
          <p className="text-[11px] font-bold text-navy-900 mb-2">
            Cakupan Tugas
          </p>
          <ul className="border-t border-earth-200/70 divide-y divide-earth-100">
            {service.items.map((item) => (
              <li key={item} className="py-2 text-sm text-earth-800 leading-snug">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[11px] font-bold text-navy-900 mb-2">
            Output yang Diterima
          </p>
          <ul className="border-t border-earth-200/70 space-y-0">
            {service.deliverables.map((d) => (
              <li
                key={d}
                className="py-2 border-b border-earth-100 flex items-start gap-2.5 text-sm text-earth-800 leading-snug"
              >
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-terracotta-500 shrink-0" />
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-earth-200/70 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm">
          <span className="text-earth-600">Estimasi Biaya: </span>
          <span className="font-bold text-navy-950">{service.priceNote}</span>
        </p>
        <Link href={`/order?category=${service.id}`}>
          <Button
            variant={service.color === "emerald" ? "emerald" : "primary"}
            className="text-xs sm:text-sm font-bold"
          >
            {service.ctaText}
          </Button>
        </Link>
      </div>
    </>
  );
}

export function ServicesSection() {
  const consultationServices = SERVICE_CATEGORIES.filter((s) => s.flowType === "consultation");
  const instantServices = SERVICE_CATEGORIES.filter((s) => s.flowType === "instant");

  return (
    <section id="layanan" className="py-20 bg-earth-50/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left rail: heading & track key. Sticky so the track key stays visible while scanning the catalog. */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-8 space-y-5">
              <div className="space-y-3">
                <p className="text-xs font-bold text-terracotta-600">Katalog Layanan</p>
                <h2 className="text-3xl sm:text-4xl font-black text-navy-950 tracking-tight">
                  Pilihan Solusi Tugas Akademik &amp; IT
                </h2>
                <p className="text-base text-earth-700 leading-relaxed">
                  Dikelola oleh tim spesialis di bidangnya masing-masing. Alur konsultasi fleksibel
                  untuk koding &amp; skripsi, serta pemesanan instan untuk slide PPT &amp; video.
                </p>
              </div>

              <div className="border-t-2 border-navy-950/10 pt-4 space-y-3">
                <div className="flex gap-4 text-sm">
                  <span className="shrink-0 w-28 font-bold text-navy-950">Konsultasi</span>
                  <span className="text-earth-700 leading-snug">
                    Coding &amp; skripsi. Harga disepakati bareng admin via WhatsApp.
                  </span>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="shrink-0 w-28 font-bold text-navy-950">Pesan instan</span>
                  <span className="text-earth-700 leading-snug">
                    PPT &amp; video. Biaya per unit, langsung hitung di kalkulator.
                  </span>
                </div>
              </div>

              <Link
                href="#alur"
                className="inline-block text-sm font-semibold text-terracotta-600 hover:text-terracotta-700 underline underline-offset-4 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 focus-visible:ring-offset-2"
              >
                Lihat 5 langkah alur pemesanan
              </Link>
            </div>
          </div>

          {/* Right: catalog rows for consultation, then one emphasized panel for the instant track. */}
          <div className="lg:col-span-8">
            <p className="text-[11px] font-bold text-navy-900 border-b-2 border-navy-950/10 pb-2 mb-2">
              Layanan Konsultasi
            </p>
            {consultationServices.map((service, idx) => (
              <article
                key={service.id}
                className={`py-7 ${
                  idx === 0 ? "" : "border-t border-earth-200/80"
                }`}
              >
                <ServiceDetail service={service} />
              </article>
            ))}

            <p className="text-[11px] font-bold text-navy-900 border-b-2 border-navy-950/10 pb-2 mb-4 mt-10">
              Layanan Pesan Instan
            </p>
            {instantServices.map((service) => (
              <article
                key={service.id}
                className="rounded-3xl border-2 border-navy-200 bg-navy-50 p-6 sm:p-8"
              >
                <ServiceDetail service={service} />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
