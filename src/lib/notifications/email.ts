import nodemailer from "nodemailer";
import { SITE_CONFIG } from "@/lib/constants";

export interface OrderConfirmedEmailInput {
  to: string;
  clientName: string;
  orderCode: string;
}

function trackingUrl(orderCode: string): string {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://tuntasin.id").replace(/\/+$/, "");
  return `${siteUrl}/tracking?code=${encodeURIComponent(orderCode)}`;
}

function adminWaUrl(): string {
  return `https://wa.me/${SITE_CONFIG.adminWhatsapp.replace(/\D/g, "")}`;
}

export async function sendOrderConfirmedEmail(input: OrderConfirmedEmailInput): Promise<void> {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    console.log(`[email] ${input.orderCode} tidak dikirim: GMAIL_USER/GMAIL_APP_PASSWORD belum diisi`);
    return;
  }

  const link = trackingUrl(input.orderCode);
  const subject = `Pesanan ${input.orderCode} sudah dikonfirmasi`;

  const text = [
    `Halo ${input.clientName},`,
    "",
    `Pembayaran DP pesanan ${input.orderCode} sudah kami konfirmasi. Tim mulai mengerjakan sekarang.`,
    "",
    `Rincian pesanan: ${link}`,
    `Ada yang perlu ditanyakan? Chat admin: ${adminWaUrl()}`,
    "",
    "Tim Tuntasin",
  ].join("\n");

  const html = `
<div style="font-family:system-ui,-apple-system,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#33202F;line-height:1.6">
  <p style="font-weight:800;font-size:16px;color:#865580;margin:0 0 20px;letter-spacing:0.02em">Tuntasin</p>
  <h1 style="font-size:18px;margin:0 0 16px;font-weight:800">Pesanan ${input.orderCode} sudah dikonfirmasi</h1>
  <p style="margin:0 0 8px">Halo ${input.clientName},</p>
  <p style="margin:0 0 8px">Pembayaran DP pesanan <strong>${input.orderCode}</strong> sudah kami konfirmasi. Tim mulai mengerjakan sekarang.</p>
  <p style="margin:24px 0">
    <a href="${link}" style="background:#B8507F;color:#ffffff;padding:12px 20px;border-radius:12px;text-decoration:none;font-weight:700;display:inline-block">Lihat Status Pesanan</a>
  </p>
  <p style="font-size:13px;color:#6B5563;margin:0 0 8px">Ada yang perlu ditanyakan? <a href="${adminWaUrl()}" style="color:#865580">Chat admin lewat WhatsApp</a>.</p>
  <p style="margin:16px 0 0">Tim Tuntasin</p>
</div>`.trim();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `Tuntasin <${user}>`,
    to: input.to,
    subject,
    text,
    html,
  });
}
