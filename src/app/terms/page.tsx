import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Syarat & Ketentuan Layanan - Tuntasin",
  description: "Ketentuan pembayaran, verifikasi QRIS, kebijakan revisi, dan transparansi pengerjaan tugas.",
};

export default function TermsPage() {
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
          Syarat & Ketentuan Layanan (Terms of Service)
        </h1>
        <p className="text-xs sm:text-sm text-earth-600">
          Terakhir diperbarui: September 2026 • Berlaku untuk seluruh layanan Tuntasin
        </p>
      </div>

      <div className="bg-white rounded-3xl border-2 border-earth-200 p-8 sm:p-12 shadow-warm space-y-8 text-sm text-earth-800 leading-relaxed">
        {/* 1. Pembayaran & DP */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-navy-950 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-terracotta-100 text-terracotta-800 flex items-center justify-center text-xs font-black">
              1
            </span>
            Ketentuan Pembayaran & Verifikasi QRIS
          </h2>
          <ul className="space-y-2 list-disc list-inside text-earth-700">
            <li>
              Pengerjaan tugas baru akan dimulai setelah <strong>Down Payment (DP) minimal 50%</strong> dibayarkan melalui kode QRIS resmi dan diverifikasi oleh admin kami di WhatsApp.
            </li>
            <li>
              User wajib melampirkan screenshot bukti transfer yang sah dan jelas (tertera tanggal, jam, nominal, dan nomor referensi).
            </li>
            <li>
              Pelunasan sisa 50% dilakukan setelah tim memberikan bukti/preview bahwa tugas telah selesai dikerjakan sesuai spesifikasi pesanan.
            </li>
          </ul>
        </section>

        {/* 2. Kebijakan Revisi */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-navy-950 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">
              2
            </span>
            Kebijakan Garansi Bebas Revisi
          </h2>
          <ul className="space-y-2 list-disc list-inside text-earth-700">
            <li>
              Kami memberikan <strong>Garansi Revisi Gratis Sepuasnya</strong> apabila hasil pengerjaan belum sesuai dengan modul instruksi, rubrik penilaian, atau kesepakatan awal saat pemesanan dibuat.
            </li>
            <li>
              Revisi yang mencakup penambahan materi baru, perubahan topik mendasar dari dosen di luar kesepakatan awal, atau perubahan bahasa pemrograman/framework secara drastis dapat dikenakan biaya penyesuaian wajar.
            </li>
            <li>
              Klaim revisi dapat diajukan dalam kurun waktu hingga 14 hari kalender setelah berkas final dikirimkan.
            </li>
          </ul>
        </section>

        {/* 3. Kebijakan Pengembalian Dana */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-navy-950 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-navy-100 text-navy-800 flex items-center justify-center text-xs font-black">
              3
            </span>
            Kebijakan Pembatalan & Pengembalian Dana (Refund)
          </h2>
          <ul className="space-y-2 list-disc list-inside text-earth-700">
            <li>
              Jika karena suatu hal di luar dugaan (force majeure) tim kami tidak dapat menyelesaikan tugas sesuai batas waktu deadline yang telah disepakati bersama, maka <strong>dana DP akan dikembalikan 100%</strong> tanpa potongan.
            </li>
            <li>
              Pembatalan sepihak oleh klien saat pengerjaan telah berjalan lebih dari 30% progres tidak dapat mengembalikan dana DP, namun klien tetap berhak menerima draft pengerjaan yang sudah diselesaikan.
            </li>
          </ul>
        </section>

        {/* 4. Etika & Penggunaan Hasil */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-navy-950 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-earth-200 text-earth-900 flex items-center justify-center text-xs font-black">
              4
            </span>
            Integritas Belajar & Panduan Akademik
          </h2>
          <p className="text-earth-700">
            Tuntasin mengedepankan asas asistensi belajar. Setiap pengerjaan tugas IT menyertakan catatan baris kode (commenting) dan panduan instalasi. Untuk dokumen karya ilmiah, kami menyertakan sumber referensi kredibel dan laporan uji Turnitin agar klien dapat mempelajari materi dengan baik saat presentasi atau tanya jawab dosen.
          </p>
        </section>

        {/* Contact Banner */}
        <div className="pt-6 border-t border-earth-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-earth-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Ada pertanyaan seputar ketentuan di atas?</span>
          </div>
          <Link href="/order">
            <Button variant="primary" size="md" className="font-semibold text-xs">
              Saya Paham & Mau Pesan Sekarang
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
