import React from "react";
import { QUALITY_COMMITMENTS } from "@/lib/constants";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export function TestimonialsSection() {
  return (
    <section id="komitmen" className="py-20 bg-earth-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4 mb-14">
          <p className="text-xs font-bold text-navy-800">Standar Pelayanan</p>
          <h2 className="text-3xl sm:text-4xl font-black text-navy-950 tracking-tight">
            Komitmen Kualitas & Transparansi
          </h2>
          <p className="text-base sm:text-lg text-earth-700">
            Setiap pengerjaan tugas tunduk pada standar mutu akademis dan perlindungan privasi yang ketat.
          </p>
        </div>

        {/* Quality Commitments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {QUALITY_COMMITMENTS.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border-2 border-earth-200/80 p-7 shadow-warm hover:shadow-warm-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-terracotta-700 bg-terracotta-50 px-3 py-1 rounded-full border border-terracotta-200">
                    {item.category}
                  </span>
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>

                <h3 className="text-lg font-bold text-navy-950 mb-2">{item.title}</h3>
                <p className="text-sm text-earth-700 leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 border-t border-earth-100 flex items-center gap-2 text-xs font-semibold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Terverifikasi Standar Operasional</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
