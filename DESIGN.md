# DESIGN.md — Arah Desain Tuntasin

Dokumen ini menyalin arah desain yang sudah ditulis di README (bukan arah baru) dan mencatat keputusan dari audit UI/UX antislop. Semua perubahan UI harus mengikuti dokumen ini.

## Arah Dasar (dari README)

Website Tuntasin dirancang profesional, tepercaya, modern, dan conversion-focused untuk mahasiswa Indonesia, dengan sifat human-centered dan "organis" (anti-AI feel):

- **Palet:** hangat — earthy cream, deep navy, terracotta, emerald.
- **Tipografi:** Plus Jakarta Sans (ramah, modern) + aksen tulisan tangan Caveat untuk catatan manusiawi.
- **Bentuk:** soft squircle & organic blobs — lengkung lembut yang nyaman di mata.
- **Alur:** conversion-focused — setiap section punya tujuan (katalog → kalkulator → kepercayaan → alur → FAQ → CTA).

## Kunci Palet (Keputusan Audit)

- Chromatic families dibatasi: **terracotta** (aksen utama/CTA), **emerald** (sukses/garansi), **navy** (teks gelap/band), plus netral **earth**. Keluarga `honey` dihapus dari palet agar tidak melebihi batas 2–3 core + 1 accent.
- Token dikoreksi demi kontras WCAG AA: `earth-500 = #846D7A` (lulus 4,5:1 di atas putih), border input interaktif memakai `earth-500`, focus ring memakai `terracotta-500`/`emerald-600`/`earth-600`, teks error `red-600`.
- Paper-pattern (titik-titik latar body) adalah motif identitas "kertas/catatan kuliah" — dipertahankan.

## Dials (Boleh Diubah Sambil Menjaga Identitas)

- Layout section (kiri/rata tengah), jumlah kolom grid per breakpoint.
- Ikon Lucide spesifik per konteks, selama relevan dan bukan dekoratif.
- Bayangan (`shadow-warm*`) boleh dinaikkan/turun untuk hierarki.
- Kuantum whitespace/breakpoint typografi.

## Jangan Diubah (Guardrails)

- **Tema light-only.** Alasan: identitas merek adalah kertas hangat (earthy cream, paper-pattern) yang sengaja terang; audiens memakai situs di siang hari di HP; dark mode tidak diminta, tidak ada kebutuhan, dan akan memecah warna kertas. Tidak akan dibangun dark mode tanpa permintaan eksplisit.
- **Gradien & glow:** hanya dengan tujuan hierarki jelas; tanpa radial glow/orb dekoratif default. Glows di hero/kalkulator/CTA dihapus pada audit; frame gradien di hero dipertahankan sebagai penekanan struktural kartu.
- **Backdrop-blur:** hanya navbar (1 elemen). Kartu memakai surface solid.
- **Badge/eyebrow di atas headline:** dihapus jika hanya mengulang judul. Badge fungsional (status, kategori, deadline, Instan/Via Admin) boleh ada.
- **Emoji:** tidak ada emoji dekoratif di UI (heading/tombol/bullet). Emoji di templat pesan WhatsApp (`lib/utils.ts`) dipertahankan karena konteksnya chat.
- **Klaim:** tanpa angka absolut yang tidak diverifikasi ("100%", "5-10 menit", "Real-Time", "Auto Detect"). Angka yang boleh: kebijakan tertulis di `/terms` (mis. refund 100% adalah ketentuan kontrak, bukan klaim performa).
- **Tap target:** minimal 44×44 px untuk semua kontrol interaktif (`Button` memakai `min-h-[44px]`).
- **Focus:** setiap kontrol interaktif wajib `focus-visible:ring-*` (jangan `outline-none` tanpa pengganti).
- **Motion:** menghormati `prefers-reduced-motion` (guard di `globals.css`).

## Alasan Keputusan Audit (Ringkas)

- Kontras diperhitungkan dengan skrip `.opencode/skills/antislop-human/contrast-check.py`, bukan tebakan.
- Workflow grid: `1 / sm:2 / lg:5` karena 5 kolom di lebar tablet terlalu sempit; connector arrow hanya muncul `lg`.
- Fitur diubah dari 4 kartu seragam + footer identik menjadi row-list agar memecah ritme seragam (aturan komposisi, bukan default card grid).
- Toggle anonim menyimpan nama asli sebelum ditimpa alias dan mengembalikannya saat OFF (mencegah kehilangan data).
- `window.open` WhatsApp dibuka hanya satu jalur (step success auto-open) untuk menghindari double popup.
