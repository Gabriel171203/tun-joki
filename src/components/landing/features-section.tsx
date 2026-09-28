import React from "react";
import { GUARANTEES } from "@/lib/constants";
import { ShieldCheck, Award, RotateCcw, BadgePercent } from "lucide-react";

export function FeaturesSection() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "ShieldCheck":
        return <ShieldCheck className="w-7 h-7 text-emerald-700" />;
      case "Award":
        return <Award className="w-7 h-7 text-terracotta-700" />;
      case "RotateCcw":
        return <RotateCcw className="w-7 h-7 text-navy-700" />;
      case "BadgePercent":
        return <BadgePercent className="w-7 h-7 text-earth-700" />;
      default:
        return <ShieldCheck className="w-7 h-7 text-emerald-700" />;
    }
  };

  return (
    <section id="keunggulan" className="py-20 bg-white border-y border-earth-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4 mb-14">
          <p className="text-xs font-bold text-emerald-700">Jaminan Kualitas Mahasiswa</p>
          <h2 className="text-3xl sm:text-4xl font-black text-navy-950 tracking-tight">
            Kenapa Mahasiswa Memilih Kami?
          </h2>
          <p className="text-base sm:text-lg text-earth-700">
            Bukan sekadar selesai, tapi kami memastikan tugas Anda aman, bermutu tinggi, dan siap dipertahankan saat evaluasi dosen.
          </p>
        </div>

        {/* Guarantees Row List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-0 border-t border-earth-200">
          {GUARANTEES.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-5 py-7 border-b border-earth-200"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                  item.color === "emerald"
                    ? "bg-emerald-100"
                    : item.color === "terracotta"
                    ? "bg-terracotta-100"
                    : "bg-earth-100"
                }`}
              >
                {getIcon(item.icon)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-navy-950 mb-1">{item.title}</h3>
                <p className="text-xs sm:text-sm text-earth-700 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
