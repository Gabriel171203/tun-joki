import { NextRequest, NextResponse } from "next/server";
import { feedbackSchema } from "@/lib/validations/feedback";
import { adminSupabase } from "@/lib/supabase/server";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

const RATE_LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 };

export async function POST(req: NextRequest) {
  try {
    const limited = await checkRateLimit(`feedback:${clientIp(req)}`, RATE_LIMIT.limit, RATE_LIMIT.windowMs);
    if (!limited.ok) {
      return NextResponse.json(
        { success: false, message: "Terlalu banyak permintaan, coba lagi beberapa menit lagi" },
        { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } }
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Body permintaan tidak valid" },
        { status: 400 }
      );
    }

    const parsed = feedbackSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Masukan tidak valid",
          issues: parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
          })),
        },
        { status: 400 }
      );
    }

    if (!adminSupabase) {
      return NextResponse.json(
        { success: false, message: "Layanan masukan belum aktif, silakan hubungi admin lewat WhatsApp" },
        { status: 503 }
      );
    }

    const { email, ...rest } = parsed.data;
    const { error } = await adminSupabase.from("feedback").insert([
      {
        ...rest,
        email: email || null,
        name: rest.name || null,
      },
    ]);

    if (error) {
      console.error("Supabase insert feedback error:", error);
      return NextResponse.json(
        { success: false, message: "Gagal mengirim masukan, silakan coba lagi" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Terima kasih, masukan Anda sudah diterima admin",
    });
  } catch (err: unknown) {
    console.error("POST /api/feedback error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
