import { createHash, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { clientIp, isRateLimited, recordRateHit } from "@/lib/rate-limit";

// Batas percobaan token yang GAGAL per IP. Pemakaian normal tidak dihitung,
// jadi admin yang mengetik benar tidak pernah terkunci.
const FAILED_ATTEMPTS = { limit: 10, windowMs: 15 * 60 * 1000 };

function tokensMatch(provided: string, expected: string): boolean {
  const a = createHash("sha256").update(provided).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

// Return null kalau lolos, atau NextResponse error kalau ditolak.
// Dipanggil paling awal di setiap route /api/admin/* sebelum validasi lain.
export async function requireAdmin(req: NextRequest): Promise<NextResponse | null> {
  const token = process.env.ADMIN_API_TOKEN;

  if (!token) {
    return NextResponse.json(
      {
        success: false,
        error:
          "API admin terkunci: ADMIN_API_TOKEN belum di-set di .env.local lalu restart dev server.",
      },
      { status: 503 }
    );
  }

  const ip = clientIp(req);
  const blockedFor = await isRateLimited(
    `admin-auth-fail:${ip}`,
    FAILED_ATTEMPTS.limit,
    FAILED_ATTEMPTS.windowMs
  );
  if (blockedFor > 0) {
    return NextResponse.json(
      { success: false, error: "Terlalu banyak percobaan token gagal, coba lagi nanti" },
      { status: 429, headers: { "Retry-After": String(blockedFor) } }
    );
  }

  const header = req.headers.get("authorization") ?? "";
  const provided = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!provided || !tokensMatch(provided, token)) {
    await recordRateHit(
      `admin-auth-fail:${ip}`,
      FAILED_ATTEMPTS.limit,
      FAILED_ATTEMPTS.windowMs
    );
    return NextResponse.json(
      { success: false, error: "Token admin tidak valid" },
      { status: 401, headers: { "WWW-Authenticate": "Bearer" } }
    );
  }

  return null;
}
