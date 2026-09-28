import { OrderStatus, ServiceCategory, TaskDifficulty } from "@/types/order";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending_verification: "Menunggu Verifikasi",
  in_progress: "Sedang Dikerjakan",
  review_ready: "Siap Direview",
  revision: "Revisi",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

export const SITE_CONFIG = {
  name: "Tuntasin",
  tagline: "Platform Jasa Akademik & IT Terpercaya Mahasiswa Indonesia",
  description:
    "Solusi pengerjaan tugas IT, pemrograman, makalah/skripsi ilmiah, hingga slide presentasi. Privasi terjaga, bebas plagiasi & AI, garansi revisi sampai tuntas.",
  adminWhatsapp: process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "6285812345678",
  adminName: process.env.NEXT_PUBLIC_ADMIN_NAME || "Admin Tuntasin",
};

export interface ServiceCategoryConfig {
  id: ServiceCategory;
  title: string;
  subtitle: string;
  shortDesc: string;
  flowType: "consultation" | "instant";
  priceNote: string;
  basePrice: number;
  icon: string;
  badge: string;
  color: "terracotta" | "emerald" | "navy";
  items: string[];
  deliverables: string[];
  ctaText: string;
}

export const SERVICE_CATEGORIES: ServiceCategoryConfig[] = [
  {
    id: "it_dev",
    title: "IT & Software Development",
    subtitle: "Web, Mobile, Scripting, & Database",
    shortDesc:
      "Tugas coding memiliki kompleksitas beragam (bahasa, framework, arsitektur). Diskusikan spesifikasi langsung dengan admin untuk estimasi harga yang adil dan transparan.",
    flowType: "consultation",
    priceNote: "Deal Harga via Diskusi Admin",
    basePrice: 150000,
    icon: "Code2",
    badge: "Konsultasi Langsung",
    color: "terracotta",
    items: [
      "Web Development (Next.js, React, Laravel, PHP, HTML/CSS)",
      "Mobile App (Flutter, React Native, Android Studio)",
      "Python Scripting, Data Science & Machine Learning",
      "Database Design & Query (MySQL, PostgreSQL, MongoDB)",
      "Tugas Algoritma, Struktur Data & OOP (Java, C++, C#)",
      "Fixing Bug, Error Handling, & Code Refactoring",
    ],
    deliverables: ["Full Source Code (GitHub/ZIP)", "Dokumentasi Alur Program", "Video Rekaman Demo / Panduan Run"],
    ctaText: "Konsultasikan Kodingan ke Admin",
  },
  {
    id: "academic_doc",
    title: "Dokumen & Karya Ilmiah",
    subtitle: "Makalah, Skripsi, Proposal, & Jurnal",
    shortDesc:
      "Kebutuhan riset, jumlah bab, metodologi, dan sitasi berbeda untuk tiap kampus. Konsultasikan draf atau judul tugas akhir Anda langsung dengan tim ahli kami.",
    flowType: "consultation",
    priceNote: "Sesuai Bab & Tingkat Riset",
    basePrice: 100000,
    icon: "BookOpen",
    badge: "Bimbingan Tim Ahli",
    color: "emerald",
    items: [
      "Makalah & Essay Akademik berbagai bidang studi",
      "Penyusunan Bab Skripsi / Tesis / Proposal Penelitian",
      "Parafrase Anti-Plagiasi & Penurunan Skor Turnitin",
      "Formatting Dokumen Standar Kampus & Jurnal Internasional",
      "Penyusunan Kuesioner & Olah Data Statistik (SPSS, SmartPLS)",
      "Terjemahan & Proofreading Abstrak / Jurnal Bahasa Inggris",
    ],
    deliverables: ["Dokumen Word & PDF Siap Cetak", "File Library Mendeley / Zotero", "Laporan Hasil Cek Turnitin"],
    ctaText: "Diskusi Materi Skripsi / Makalah",
  },
  {
    id: "media_presentation",
    title: "Presentasi & Media Kreatif",
    subtitle: "Slide PPT Interaktif & Video Tugas",
    shortDesc:
      "Satuan terstandarisasi (per slide atau per menit video). Anda bisa langsung menghitung biaya estimasi di kalkulator dan memesan dengan pembayaran DP QRIS.",
    flowType: "instant",
    priceNote: "Mulai Rp 50.000 (Paket Ringkas)",
    basePrice: 50000,
    icon: "Presentation",
    badge: "Kalkulator & QRIS Instan",
    color: "navy",
    items: [
      "Desain Slide Presentasi PowerPoint / Canva Modern",
      "Slide Sidang Skripsi / Seminar Proposal Interaktif",
      "Editing Video Tugas Kelompok, Vlog Edukasi, & Iklan",
      "Animasi Penjelasan / Motion Graphics Sederhana",
      "Desain Infografis Akademik, Poster Ilmiah, & Banner",
      "Voice Over & Subtitle Bilingual (ID - EN)",
    ],
    deliverables: ["File PPTX Editable & PDF", "Video Render Full HD (1080p)", "Aset Grafis Original"],
    ctaText: "Hitung Biaya & Pesan PPT/Media",
  },
];

export const DIFFICULTY_RATES: Record<TaskDifficulty, { label: string; multiplier: number; desc: string }> = {
  easy: {
    label: "Tingkat Dasar",
    multiplier: 1.0,
    desc: "Tugas mingguan, soal logika dasar, makalah ringkas (3-7 halaman), atau slide standard.",
  },
  medium: {
    label: "Tingkat Menengah",
    multiplier: 1.45,
    desc: "Aplikasi CRUD, olah data statistik, makalah komprehensif (10-25 halaman), atau video kreatif.",
  },
  hard: {
    label: "Tingkat Kompleks / Akhir",
    multiplier: 2.1,
    desc: "Fullstack web/mobile, integrasi API/AI, Bab Skripsi komplit, atau sistem terdistribusi.",
  },
};

export const DEADLINE_TIERS = [
  { id: "express_12h", hours: 12, label: "Kilat (12 Jam)", multiplier: 1.6, badge: "Ekspres" },
  { id: "fast_24h", hours: 24, label: "Cepat (24 Jam)", multiplier: 1.35, badge: "Prioritas" },
  { id: "standard_3d", hours: 72, label: "Reguler (2-3 Hari)", multiplier: 1.0, badge: "Standar" },
  { id: "relaxed_5d", hours: 120, label: "Santai (5+ Hari)", multiplier: 0.85, badge: "Hemat" },
];

export const GUARANTEES = [
  {
    title: "Kerahasiaan Identitas",
    description: "Kami tidak pernah meminta NIM atau akun kampus. Setelah pesanan tuntas, Anda bisa minta admin menghapus berkas dari sistem.",
    icon: "ShieldCheck",
    color: "emerald",
  },
  {
    title: "Bebas Plagiasi & Bebas AI",
    description: "Dikerjakan murni oleh tim sarjana & praktisi berpengalaman. Menyediakan laporan Turnitin resmi tanpa biaya tambahan.",
    icon: "Award",
    color: "terracotta",
  },
  {
    title: "Garansi Revisi Sepuasnya",
    description: "Dosen minta perbaikan? Kami revisi gratis hingga tugas Anda dinyatakan tuntas dan sesuai kriteria awal.",
    icon: "RotateCcw",
    color: "navy",
  },
  {
    title: "Transparan & Tanpa Tipu-Tipu",
    description: "Cukup DP 50% lewat QRIS resmi setelah ada kesepakatan jelas. Anda dapat preview hasil tugas sebelum pelunasan.",
    icon: "BadgePercent",
    color: "navy",
  },
];

export const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Kirim Brief / Rincian Tugas",
    desc: "Isi form singkat atau unggah soal tugas Anda. Pilih opsi anonim bila ingin identitas kampus tetap dirahasiakan.",
  },
  {
    step: "02",
    title: "Diskusi Harga atau Hitung Instan",
    desc: "Coding & Skripsi: langsung terhubung ke WhatsApp admin untuk negosiasi harga sesuai spesifikasi. PPT & Media: gunakan kalkulator instan.",
  },
  {
    step: "03",
    title: "Kesepakatan & DP via QRIS",
    desc: "Setelah sepakat, lakukan pembayaran uang muka (DP 50%) menggunakan scan QRIS resmi toko dari m-Banking atau E-Wallet.",
  },
  {
    step: "04",
    title: "Proses Pengerjaan & Update",
    desc: "Tim ahli langsung mengeksekusi tugas. Anda akan menerima update berkala dan bebas menanyakan progres pengerjaan di WhatsApp.",
  },
  {
    step: "05",
    title: "Review Hasil & Selesai",
    desc: "Periksa draft hasil tugas. Ajukan revisi bila diperlukan sampai sesuai rubrik dosen, lalu lakukan pelunasan saat Anda puas.",
  },
];

export const FAQS = [
  {
    question: "Mengapa tugas coding dan skripsi harus konsultasi langsung ke admin?",
    answer:
      "Karena setiap tugas pemrograman dan karya ilmiah memiliki spesifikasi yang sangat unik (bahasa koding, kompleksitas database, metodologi riset, atau rubrik dosen). Dengan konsultasi via WhatsApp, admin dapat mempelajari modul Anda terlebih dahulu sehingga harga yang disepakati benar-benar adil dan realistis tanpa biaya yang dilebih-lebihkan.",
  },
  {
    question: "Tugas apa saja yang bisa langsung dihitung biayanya di website?",
    answer:
      "Tugas yang memiliki parameter kerja terstandarisasi seperti pembuatan Slide Presentasi PowerPoint/Canva (dihitung per slide) dan pengeditan Video Tugas Kuliah (dihitung berdasarkan durasi). Anda bisa langsung melihat estimasi biaya dan membayar DP 50% via QRIS di website.",
  },
  {
    question: "Apakah identitas dan data kampus saya benar-benar aman?",
    answer:
      "Kami menerapkan prinsip anonimitas ketat. Anda bisa memakai fitur 'Pesan Anonim' sehingga tidak perlu mencantumkan nama asli atau identitas kampus. Berkas disimpan dengan nama acak, dan setelah pesanan selesai Anda bisa minta admin menghapusnya lewat WhatsApp.",
  },
  {
    question: "Bagaimana cara kerja pembayaran menggunakan QRIS?",
    answer:
      "Setelah menyepakati harga dengan admin atau setelah mengisi form pesanan, sistem atau admin akan memberikan kode QRIS resmi toko. Anda cukup membuka aplikasi Mobile Banking (BCA, Mandiri, BRI, BNI, BSI) atau E-Wallet (GoPay, OVO, DANA, ShopeePay), lalu scan QRIS untuk transfer DP (50%). Kemudian kirimkan bukti transfer.",
  },
  {
    question: "Apakah pengerjaan tugas menggunakan AI (ChatGPT) yang kaku?",
    answer:
      "Sama sekali TIDAK. Semua tugas dikerjakan langsung secara manual oleh tim sarjana PTN dan praktisi IT profesional. Dokumen akademik kami sertakan laporan Turnitin dan AI Detector untuk menjamin keaslian tulisan.",
  },
  {
    question: "Bagaimana jika dosen meminta revisi setelah tugas dikirimkan?",
    answer:
      "Kami memberikan Garansi Bebas Revisi sesuai dengan instruksi dan kesepakatan awal pemesanan. Cukup hubungi admin via WhatsApp dan kirimkan catatan perbaikan dari dosen, kami akan langsung memproses perbaikannya secepat mungkin.",
  },
];

export const QUALITY_COMMITMENTS = [
  {
    category: "Anti-Plagiarisme",
    title: "Laporan Turnitin & AI Detector",
    description:
      "Setiap tugas akademik disertai bukti cek Turnitin dan AI Detector, memastikan tulisan asli buatan manusia dan lolos standar kampus.",
  },
  {
    category: "Privasi & Anonimitas",
    title: "Anonimitas & Permintaan Hapus Berkas",
    description:
      "Anda bisa memesan tanpa menyertakan nama asli atau identitas kampus. Setelah pesanan selesai, admin menghapus berkas tugas dari sistem atas permintaan Anda.",
  },
  {
    category: "Garansi Revisi",
    title: "Revisi Gratis Sesuai Brief Awal",
    description:
      "Jika dosen meminta perbaikan yang masih sesuai instruksi awal, kami kerjakan ulang tanpa biaya tambahan hingga Anda puas.",
  },
  {
    category: "Pengerjaan Manual",
    title: "Dikerjakan Tim Sarjana & Praktisi IT",
    description:
      "Bukan hasil AI copy-paste. Setiap tugas dikerjakan langsung oleh sarjana PTN dan profesional berpengalaman di bidangnya.",
  },
];
