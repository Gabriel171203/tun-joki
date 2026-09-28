# 🎓 Tuntasin - Platform Jasa Akademik & IT (QRIS & WhatsApp Flow)

Website penyedia jasa layanan tugas akademik, tugas pemrograman IT, karya ilmiah/skripsi, pembuatan slide presentasi, hingga pengeditan video. Dirancang secara profesional, tepercaya, modern, dan berorientasi konversi (*conversion-focused*) untuk mahasiswa Indonesia.

---

## 🌟 Fitur Utama

1. **Desain Human-Centered & Organis (Anti-AI Feel):**
   - Menggunakan palet warna hangat (*earthy cream, deep navy, terracotta, emerald*).
   - Tipografi yang ramah (*Plus Jakarta Sans* & aksen tulisan tangan *Caveat*).
   - Bentuk lengkung lembut (*soft squircle* & *organic blobs*) yang nyaman di mata.

2. **Kalkulator Estimasi Biaya Interaktif:**
   - Pilihan kategori tugas:
     - **IT & Software Development** (Web, Mobile, Python, Database, Algoritma)
     - **Dokumen & Karya Ilmiah** (Makalah, Bab Skripsi/Proposal, Format APA/IEEE, Parafrase Turnitin)
     - **Presentasi & Media Kreatif** (Slide PPT Interaktif, Video Tugas, Infografis)
   - Slider tingkat kesulitan & batas deadline (Kilat 12 jam s/d Reguler 5 hari).
   - Kalkulasi otomatis total biaya, DP wajib 50%, dan pelunasan saat selesai.

3. **Multi-Step Checkout & QRIS Flow:**
   - **Langkah 1 (Detail Tugas):** Input instruksi tugas, deadline, dan opsi **Mode Anonim** (tanpa nama asli kampus).
   - **Langkah 2 (Ringkasan & Scan QRIS):** Tampilan resmi kode QRIS toko dengan tombol unduh gambar ke galeri HP & tombol salin nominal DP.
   - **Langkah 3 (Upload Bukti Bayar):** Uploader foto/screenshot bukti transfer (JPG/PNG/WEBP, maks 5MB) dengan preview dan nama berkas acak (UUID).
   - **Langkah 4 (Redirect WhatsApp Admin):** Redirect otomatis ke `https://wa.me/...` dengan pesan terformat rapi menyertakan Kode Pesanan, rincian pengerjaan, link file tugas, dan link bukti bayar QRIS.

4. **Pelacakan Status Pesanan Real-Time (`/tracking`):**
   - Mahasiswa dapat memantau progres pesanan cukup dengan memasukkan Kode Pesanan (contoh: `TS-2026-X89K`).
   - Stepper visual: Verifikasi QRIS ➔ Sedang Dikerjakan ➔ Quality Check & Turnitin ➔ Selesai.

5. **Kebijakan & Keamanan Data Mahasiswa:**
   - Halaman **Syarat & Ketentuan** (`/terms`): Ketentuan DP 50%, garansi revisi gratis sepuasnya, dan kebijakan refund 100% jika lewat deadline.
   - Halaman **Kebijakan Privasi** (`/privacy`): Prinsip anonimitas mutlak, nama berkas acak (UUID), dan penghapusan berkas manual oleh admin.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router, React 19, TypeScript)
- **Styling:** Tailwind CSS + PostCSS + Autoprefixer
- **Icons:** Lucide React
- **Validation:** Zod + React Hook Form
- **Storage & Database:** Supabase (PostgreSQL & Storage Buckets) dengan mode *Graceful Fallback* lokal
- **Effects:** Canvas Confetti

---

## 🚀 Cara Menjalankan Aplikasi Secara Lokal

### 1. Clone & Install Dependencies
```bash
git clone <repo-url>
cd joki_tugas
npm install
```

### 2. Konfigurasi Environment Variables
Salin file `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```
Sesuaikan konfigurasi berikut:
```env
# Nomor WhatsApp Admin (Gunakan format 62xxx tanpa + atau tanda hubung)
NEXT_PUBLIC_ADMIN_WHATSAPP=6285812345678
NEXT_PUBLIC_ADMIN_NAME="Admin Tuntasin"

# Supabase (Opsional saat dev: jika belum diisi, sistem menggunakan penyimpanan lokal/mock)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Storage Buckets
NEXT_PUBLIC_STORAGE_BUCKET_PAYMENTS=payment-proofs
NEXT_PUBLIC_STORAGE_BUCKET_TASKS=task-files
```

### 3. Setup Database Supabase (Opsional untuk Produksi)
Buka Dashboard Supabase Anda, masuk ke **SQL Editor**, dan jalankan seluruh isi query dari file:
```
supabase/schema.sql
```
Lalu buat 2 bucket di menu **Storage**:
1. `payment-proofs` (Public)
2. `task-files` (Public)

### 4. Jalankan Development Server
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

---

## 📱 Format Pesan WhatsApp Otomatis
Pesan yang digenerate otomatis ke nomor admin memiliki struktur berikut:

```text
Halo Admin Tuntasin, saya ingin mengonfirmasi pesanan tugas baru:

━━━━━━━━━━━━━━━━━━━━
📌 DETAIL PESANAN TUGAS
━━━━━━━━━━━━━━━━━━━━
🆔 Kode Pesanan: `TS-2026-X89K`
👤 Nama Pemesan: Dimas (🎭 Anonim Terlindungi)
🎓 Jenjang: S1
📂 Kategori Layanan: IT & Software Development
📝 Judul / Topik: Aplikasi Web Next.js Toko Online
⏱️ Batas Deadline: Sabtu, 20 September 2026 23:59
📊 Tingkat Kesulitan: Tingkat Menengah

━━━━━━━━━━━━━━━━━━━━
💰 RINCIAN BIAYA & PEMBAYARAN
━━━━━━━━━━━━━━━━━━━━
💵 Estimasi Total: Rp 350.000
💳 Nominal DP (50%): Rp 175.000
🧾 Status: Bukti Bayar QRIS Telah Diunggah

━━━━━━━━━━━━━━━━━━━━
📎 TAUTAN BERKAS & BUKTI BAYAR
━━━━━━━━━━━━━━━━━━━━
📁 File Tugas/Soal: https://...
📸 BUKTI BAYAR QRIS:
👉 https://.../payment-proofs/172664_uuid.png

━━━━━━━━━━━━━━━━━━━━
💬 Catatan / Instruksi Dosen:
"Gunakan Tailwind CSS dan sediakan dokumentasi instalasi."
━━━━━━━━━━━━━━━━━━━━
```

---

## 📦 Deployment ke Vercel

1. Push repository ke GitHub/GitLab.
2. Hubungkan repository di [Vercel](https://vercel.com).
3. Masukkan Environment Variables (`NEXT_PUBLIC_ADMIN_WHATSAPP`, `NEXT_PUBLIC_SUPABASE_URL`, dll).
4. Klik **Deploy**!
