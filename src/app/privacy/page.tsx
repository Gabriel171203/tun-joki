import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowLeft, Lock, Trash2, KeyRound } from "lucide-react";

export const metadata = {
  title: "Kebijakan Privasi & Keamanan Data - Tuntasin",
  description: "Anonimitas pengguna, nama berkas acak, dan penghapusan berkas oleh admin.",
};

export default function PrivacyPage() {
  return (
    <div className="py-12 md:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="space-y-3">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-2 -ml-2 text-xs">
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Beranda
          </Button>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black text-navy-950 tracking-tight">
          Kebijakan Privasi & Perlindungan Data Mahasiswa
        </h1>
        <p className="text-xs sm:text-sm text-earth-600">
          Prioritas nomor satu kami adalah keamanan, anonimitas, dan kerahasiaan penuh setiap pengguna.
        </p>
      </div>

      <div className="bg-white rounded-3xl border-2 border-earth-200 p-8 sm:p-12 shadow-warm space-y-8 text-sm text-earth-800 leading-relaxed">
        {/* 1. Prinsip Anonimitas */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-navy-950">1. Prinsip Anonimitas Mutlak</h2>
          </div>
          <p className="text-earth-700">
            Kami memahami sensitivitas pengerjaan tugas perkuliahan. Oleh karena itu:
          </p>
          <ul className="space-y-2 list-disc list-inside text-earth-700 pl-2">
            <li>
              Anda dapat menggunakan fitur <strong>&ldquo;Pesan Anonim&rdquo;</strong> sehingga tidak perlu memberikan nama asli.
            </li>
            <li>
              Kami <strong>tidak pernah</strong> meminta Nomor Induk Mahasiswa (NIM), data akun kampus, password portal akademik, ataupun kartu tanda mahasiswa (KTM).
            </li>
            <li>
              Data WhatsApp hanya dipakai untuk komunikasi koordinasi pengerjaan pesanan dan tidak akan pernah dibagikan kepada pihak lain.
            </li>
          </ul>
        </section>

        {/* 2. Nama Berkas Acak */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-terracotta-100 text-terracotta-800 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-navy-950">2. Nama Berkas Acak &amp; Tautan Tidak Dipublikasikan</h2>
          </div>
          <p className="text-earth-700">
            Setiap dokumen tugas, soal, modul, maupun foto bukti transfer QRIS yang Anda unggah melewati server kami, lalu disimpan di penyimpanan cloud dengan nama acak (timestamp + UUID), bukan nama asli berkas. Lokasi berkas jadi tidak bisa ditebak, dan kami tidak pernah menautkan berkas tersebut di halaman publik mana pun. Berkas dibuka lewat tautan langsung, jadi orang yang berhasil memperoleh tautannya tetap bisa membuka berkas itu.
          </p>
        </section>

        {/* 3. Penghapusan Berkas oleh Admin */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-navy-100 text-navy-800 flex items-center justify-center">
              <Trash2 className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-navy-950">3. Penghapusan Berkas oleh Admin</h2>
          </div>
          <p className="text-earth-700">
            Penghapusan berkas dilakukan manual oleh admin dari dashboard kami, misalnya ketika Anda meminta berkas dihapus setelah pesanan tuntas. Belum ada penghapusan otomatis berkala di sistem saat ini, jadi kalau Anda ingin berkas dihapus, hubungi admin lewat WhatsApp dan minta penghapusan.
          </p>
        </section>

        {/* 4. Tidak Ada Publikasi Karya */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-earth-200 text-earth-900 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-navy-950">4. Perlindungan Orisinalitas & Portofolio</h2>
          </div>
          <p className="text-earth-700">
            Tugas yang telah dikerjakan untuk Anda tidak akan pernah kami jual kembali kepada mahasiswa lain, tidak dipublikasikan ke internet, dan tidak dijadikan portofolio publik tanpa persetujuan tertulis eksplisit dari Anda.
          </p>
        </section>

        <div className="pt-6 border-t border-earth-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-earth-600">
            Kami hanya menyimpan data yang Anda isi sendiri saat memesan.
          </p>
          <Link href="/order">
            <Button variant="emerald" size="md" className="font-semibold text-xs shadow-warm">
              Mulai Pesan dengan Mode Anonim
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
