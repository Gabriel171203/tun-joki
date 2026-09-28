import type { NextRequest } from "next/server";
import { adminSupabase } from "@/lib/supabase/server";

// Rate limiter fixed-window. Sumber kebenaran utama: tabel Supabase
// (rate_limits + RPC rate_limit) — state terbagi antar instance serverless
// dan tahan cold start. Cadangan: map memori, dipakai saat Supabase belum
// terkonfigurasi atau query gagal; saat itu perlindungan hanya per-instance.
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 10_000;

type RateResult = { blocked: boolean; retryAfter: number };

async function applyRateLimit(
  key: string,
  limit: number,
  windowMs: number,
  count: boolean
): Promise<RateResult> {
  if (adminSupabase) {
    try {
      const { data, error } = await adminSupabase.rpc("rate_limit", {
        p_key: key,
        p_limit: limit,
        p_window_ms: windowMs,
        p_count: count,
      });
      if (!error && data) {
        const d = data as { blocked?: boolean; retry_after?: number };
        return { blocked: Boolean(d.blocked), retryAfter: Number(d.retry_after) || 0 };
      }
      if (error) console.error("Rate limit RPC gagal, fallback memori:", error.message);
    } catch (err) {
      console.error(
        "Rate limit RPC gagal, fallback memori:",
        err instanceof Error ? err.message : err
      );
    }
  }
  return memoryRateLimit(key, limit, windowMs, count);
}

function memoryRateLimit(key: string, limit: number, windowMs: number, count: boolean): RateResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    makeRoom(now);
    buckets.set(key, { count: count ? 1 : 0, resetAt: now + windowMs });
    return { blocked: false, retryAfter: 0 };
  }

  if (bucket.count >= limit) {
    return { blocked: true, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  if (count) bucket.count += 1;
  return { blocked: false, retryAfter: 0 };
}

// Dipakai route publik: hitung setiap permintaan, tolak saat melewati limit.
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ ok: boolean; retryAfterSeconds: number }> {
  const r = await applyRateLimit(key, limit, windowMs, true);
  return { ok: !r.blocked, retryAfterSeconds: r.retryAfter };
}

// Varian untuk autentikasi: hanya kegagalan yang dihitung, jadi pemakaian
// normal admin tidak pernah terkunci. Cek dulu (isRateLimited), catat saat
// gagal (recordRateHit).
export async function isRateLimited(key: string, limit: number, windowMs: number): Promise<number> {
  const r = await applyRateLimit(key, limit, windowMs, false);
  return r.blocked ? r.retryAfter : 0;
}

export async function recordRateHit(key: string, limit: number, windowMs: number): Promise<void> {
  await applyRateLimit(key, limit, windowMs, true);
}

function makeRoom(now: number): void {
  if (buckets.size < MAX_BUCKETS) return;
  // Map mempertahankan urutan insert: buang yang paling lama dulu.
  for (const [oldKey, oldBucket] of buckets) {
    if (buckets.size < MAX_BUCKETS) break;
    if (oldBucket.resetAt <= now) buckets.delete(oldKey);
  }
  while (buckets.size >= MAX_BUCKETS) {
    const oldest = buckets.keys().next().value;
    if (oldest === undefined) break;
    buckets.delete(oldest);
  }
}

export function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}
