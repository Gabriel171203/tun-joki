import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ServiceCategory, TaskDifficulty, OrderCalculation, OrderRecord } from "@/types/order";
import { SERVICE_CATEGORIES, DIFFICULTY_RATES, SITE_CONFIG } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function cleanPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.substring(1);
  } else if (cleaned.startsWith("+62")) {
    cleaned = cleaned.substring(1);
  } else if (!cleaned.startsWith("62")) {
    cleaned = "62" + cleaned;
  }
  return cleaned;
}

// Versi client: dipakai sebagai kode sementara untuk mirror lokal sebelum
// API menggantinya dengan kode resmi (lihat src/lib/server/order-code.ts).
// 256 % 32 === 0 sehingga pembagian modulo tidak bias.
export function generateOrderCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(6);
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  let randomStr = "";
  for (let i = 0; i < 6; i++) {
    randomStr += chars.charAt(bytes[i] % chars.length);
  }
  const year = new Date().getFullYear();
  return `TS-${year}-${randomStr}`;
}

export function calculateOrderPricing(
  category: ServiceCategory,
  difficulty: TaskDifficulty = "medium",
  deadlineHours: number = 48
): OrderCalculation {
  const categoryConfig = SERVICE_CATEGORIES.find((c) => c.id === category) || SERVICE_CATEGORIES[2];
  const basePrice = categoryConfig.basePrice;

  const difficultyMultiplier = DIFFICULTY_RATES[difficulty]?.multiplier || 1.45;

  let urgencyMultiplier = 1.0;
  if (deadlineHours <= 12) {
    urgencyMultiplier = 1.6;
  } else if (deadlineHours <= 24) {
    urgencyMultiplier = 1.35;
  } else if (deadlineHours <= 72) {
    urgencyMultiplier = 1.0;
  } else {
    urgencyMultiplier = 0.85;
  }

  // Calculate rounded to nearest 5,000 IDR
  const rawTotal = basePrice * difficultyMultiplier * urgencyMultiplier;
  const totalPrice = Math.round(rawTotal / 5000) * 5000;
  const dpAmount = Math.round(totalPrice * 0.5 / 5000) * 5000;
  const remainingAmount = totalPrice - dpAmount;

  return {
    basePrice,
    difficultyMultiplier,
    urgencyMultiplier,
    totalPrice,
    dpAmount,
    remainingAmount,
  };
}

export function createWhatsAppConsultationLink(brief: {
  client_name?: string;
  is_anonymous?: boolean;
  education_level?: string;
  service_category?: ServiceCategory;
  task_title?: string;
  task_description?: string;
  deadline_date?: string;
  task_file_url?: string;
}): string {
  const adminPhone = cleanPhoneNumber(SITE_CONFIG.adminWhatsapp);
  const categoryTitle =
    SERVICE_CATEGORIES.find((c) => c.id === brief.service_category)?.title || "Coding / Karya Ilmiah";

  const clientDisplay = brief.is_anonymous
    ? `${brief.client_name || "Mahasiswa"} (🎭 Anonim)`
    : brief.client_name || "Mahasiswa";

  const message = `Halo ${SITE_CONFIG.adminName}, saya ingin konsultasi tugas *${categoryTitle}*:

━━━━━━━━━━━━━━━━━━━━
📌 *BRIEF KONSULTASI TUGAS*
━━━━━━━━━━━━━━━━━━━━
👤 *Nama:* ${clientDisplay}
🎓 *Jenjang:* ${brief.education_level || "S1 (Perkuliahan)"}
📝 *Topik / Judul:* ${brief.task_title || "Konsultasi Tugas"}
⏱️ *Batas Waktu:* ${brief.deadline_date ? new Date(brief.deadline_date).toLocaleString("id-ID", { dateStyle: "full", timeStyle: "short" }) : "-"}

━━━━━━━━━━━━━━━━━━━━
💬 *Kebutuhan / Rincian Soal:*
"${brief.task_description || "-"}"

${brief.task_file_url ? `📁 *Tautan Berkas Soal:* ${brief.task_file_url}\n` : "📁 *Berkas:* Saya kirimkan langsung di chat ini\n"}
━━━━━━━━━━━━━━━━━━━━

Mohon dibantu review soal dan info perkiraan biaya serta estimasi pengerjaannya ya min. Terima kasih! 🙏`;

  return `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
}

export function createWhatsAppOrderLink(order: Partial<OrderRecord>): string {
  const adminPhone = cleanPhoneNumber(SITE_CONFIG.adminWhatsapp);

  const categoryName =
    SERVICE_CATEGORIES.find((c) => c.id === order.service_category)?.title || order.service_category || "Tugas Akademik / IT";

  const clientDisplay = order.is_anonymous
    ? `${order.client_name} (🎭 Anonim Terlindungi)`
    : order.client_name || "Pelanggan";

  const message = `Halo ${SITE_CONFIG.adminName}, saya ingin mengonfirmasi pesanan tugas:

━━━━━━━━━━━━━━━━━━━━
📌 *DETAIL PESANAN TUGAS*
━━━━━━━━━━━━━━━━━━━━
🆔 *Kode Pesanan:* \`${order.order_code}\`
👤 *Nama Pemesan:* ${clientDisplay}
🎓 *Jenjang:* ${order.education_level || "S1"}
📂 *Kategori Layanan:* ${categoryName}
📝 *Judul / Topik:* ${order.task_title}
⏱️ *Batas Deadline:* ${order.deadline_date ? new Date(order.deadline_date).toLocaleString("id-ID", { dateStyle: "full", timeStyle: "short" }) : "-"}
📊 *Tingkat Kesulitan:* ${order.difficulty ? DIFFICULTY_RATES[order.difficulty]?.label : "Menengah"}

━━━━━━━━━━━━━━━━━━━━
💰 *RINCIAN BIAYA & PEMBAYARAN*
━━━━━━━━━━━━━━━━━━━━
💵 *Estimasi Total:* ${order.estimated_price ? formatRupiah(order.estimated_price) : "-"}
💳 *Nominal DP (50%):* ${order.dp_amount ? formatRupiah(order.dp_amount) : "-"}
🧾 *Status:* Bukti Bayar QRIS Telah Diunggah

━━━━━━━━━━━━━━━━━━━━
📎 *TAUTAN BERKAS & BUKTI BAYAR*
━━━━━━━━━━━━━━━━━━━━
${order.task_file_url ? `📁 *File Tugas/Soal:* ${order.task_file_url}\n` : "📁 *File Tugas:* Terlampir di chat ini / Menyusul\n"}
📸 *BUKTI BAYAR QRIS:*
👉 ${order.payment_proof_url || "(Terlampir di chat ini)"}

━━━━━━━━━━━━━━━━━━━━
💬 *Catatan / Instruksi Dosen:*
"${order.task_description || "-"}"
━━━━━━━━━━━━━━━━━━━━

Mohon segera diverifikasi pembayaran QRIS dan diproses pengerjaannya ya min. Terima kasih! 🙏`;

  return `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
}
