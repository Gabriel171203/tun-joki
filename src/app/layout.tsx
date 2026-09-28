import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Caveat } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  // Ikon tab memakai logo yang sudah ada di /public, tanpa aset baru.
  // Tanpa baris ini browser meminta /favicon.ico dan menerima 404.
  icons: { icon: "/image.svg" },
  title: "Tuntasin - Jasa Joki Akademik, Skripsi & Tugas IT Profesional (QRIS & WA)",
  description:
    "Solusi pengerjaan tugas kuliah terpercaya: Pemrograman IT, Web, Mobile, Skripsi, Makalah ilmiah, Slide Presentasi & Video. Bebas plagiasi, privasi terjaga, pembayaran QRIS instan.",
  keywords: [
    "Joki Tugas IT",
    "Jasa Pembuatan Web",
    "Jasa Skripsi Informatika",
    "Jasa Joki Makalah",
    "Jasa Slide Presentasi PPT",
    "Jasa Joki Tugas Kuliah",
    "Bayar Joki QRIS",
    "Jasa Bikin Aplikasi",
  ],
  authors: [{ name: "Tuntasin Team" }],
  openGraph: {
    title: "Tuntasin - Solusi Tugas Akademik & IT Mahasiswa Indonesia",
    description: "Pengerjaan tugas cepat, bebas plagiasi & AI, garansi revisi, pembayaran mudah via QRIS.",
    url: "https://tuntasin.id",
    siteName: "Tuntasin",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} ${caveat.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col font-sans paper-pattern selection:bg-terracotta-200 selection:text-terracotta-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
