import { NextRequest, NextResponse } from "next/server";
import { orderCodeSchema } from "@/lib/validations/order";
import { adminSupabase } from "@/lib/supabase/server";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

// Tracking memang butuh status & detail pengerjaan, tapi bukan PII kontak.
// Kolom ini dipilih eksplisit agar whatsapp, email, dan client_name tidak
// ikut terkirim ke siapa pun yang menebak kode pesanan.
const TRACKED_COLUMNS = [
  "order_code",
  "status",
  "admin_notes",
  "service_category",
  "task_title",
  "deadline_date",
  "estimated_price",
  "dp_amount",
  "task_file_name",
  "payment_proof_url",
  "created_at",
  "updated_at",
].join(",");

const RATE_LIMIT = { limit: 30, windowMs: 60 * 1000 };

export async function GET(req: NextRequest) {
  try {
    const limited = await checkRateLimit(`order-track:${clientIp(req)}`, RATE_LIMIT.limit, RATE_LIMIT.windowMs);
    if (!limited.ok) {
      return NextResponse.json(
        { success: false, message: "Terlalu banyak permintaan, coba lagi sebentar lagi" },
        { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } }
      );
    }

    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { success: false, message: "Parameter code wajib disertakan" },
        { status: 400 }
      );
    }

    const parsedCode = orderCodeSchema.safeParse(code.trim().toUpperCase());
    if (!parsedCode.success) {
      return NextResponse.json(
        { success: false, message: "Format kode pesanan tidak valid" },
        { status: 400 }
      );
    }

    if (adminSupabase) {
      const { data, error } = await adminSupabase
        .from("orders")
        .select(TRACKED_COLUMNS)
        .eq("order_code", parsedCode.data)
        .single();

      if (data) {
        return NextResponse.json({ success: true, order: data });
      }

      if (error && error.code !== "PGRST116") {
        console.error("Supabase track error:", error);
      }
    }

    return NextResponse.json(
      { success: false, message: "Pesanan tidak ditemukan" },
      { status: 404 }
    );
  } catch (err: unknown) {
    console.error("GET /api/orders/track error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
