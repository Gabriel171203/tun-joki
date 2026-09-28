import { randomInt } from "crypto";

// Alfabet 32 karakter tanpa I/O/0/1 supaya tidak tertukar saat diketik manual.
const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const LENGTH = 6; // 32^6 ≈ 1,07 miliar kombinasi

// Hanya untuk kode yang dibuat di server (API POST /api/orders).
// Versi client ada di src/lib/utils.ts untuk mirror lokal saat API gagal.
export function generateOrderCode(): string {
  let randomStr = "";
  for (let i = 0; i < LENGTH; i++) {
    randomStr += CHARS[randomInt(0, CHARS.length)];
  }
  return `TS-${new Date().getFullYear()}-${randomStr}`;
}
