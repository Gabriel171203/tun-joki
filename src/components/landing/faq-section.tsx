"use client";

import React, { useState } from "react";
import { FAQS } from "@/lib/constants";
import { ChevronDown } from "lucide-react";

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 bg-white border-t border-earth-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-navy-950 tracking-tight">
            Tanya Jawab Seputar Layanan
          </h2>
          <p className="text-base sm:text-lg text-earth-700">
            Punya keraguan seputar keamanan, garansi, atau cara bayar? Simak jawaban lengkap di bawah ini.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border-2 border-earth-200/80 bg-earth-50/40 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  className="w-full p-5 min-h-[44px] text-left flex items-center justify-between gap-4 font-bold text-navy-950 hover:text-terracotta-600 transition-colors"
                >
                  <span className="text-sm sm:text-base">{faq.question}</span>
                  <div
                    className={`w-7 h-7 rounded-xl bg-white border border-earth-500 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-terracotta-50 text-terracotta-600 border-terracotta-500" : "text-earth-600"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-earth-700 leading-relaxed border-t border-earth-200/50">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
