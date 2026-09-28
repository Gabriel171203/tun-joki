import { NextRequest, NextResponse } from "next/server";
import { orderCreateSchema, type OrderCreateInput } from "@/lib/validations/order";
import { adminSupabase } from "@/lib/supabase/server";
import { generateOrderCode } from "@/lib/server/order-code";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";
import { calculateOrderPricing } from "@/lib/utils";

const RATE_LIMIT = { limit: 10, windowMs: 10 * 60 * 1000 };
const CODE_ATTEMPTS = 3;

// Hitung ulang harga di server. Client hanya penampil, bukan sumber kebenaran:
// angka dari payload tidak pernah masuk ke database.
// - Alur QRIS instan (ada bukti bayar): harga = f(kategori, kesulitan, sisa jam).
// - Alur konsultasi (tanpa bukti): biaya menyusul, disimpan 0.
function recomputePrice(input: OrderCreateInput): { estimated_price: number; dp_amount: number } {
  if (!input.payment_proof_url) return { estimated_price: 0, dp_amount: 0 };

  const diffMs = new Date(input.deadline_date).getTime() - Date.now();
  const deadlineHours = Number.isNaN(diffMs) ? 48 : Math.max(12, Math.round(diffMs / 3_600_000));
  const pricing = calculateOrderPricing(input.service_category, input.difficulty, deadlineHours);
  return { estimated_price: pricing.totalPrice, dp_amount: pricing.dpAmount };
}

export async function POST(req: NextRequest) {
  try {
    const limited = await checkRateLimit(`order-create:${clientIp(req)}`, RATE_LIMIT.limit, RATE_LIMIT.windowMs);
    if (!limited.ok) {
      return NextResponse.json(
        { success: false, message: "Terlalu banyak permintaan, coba lagi beberapa menit lagi" },
        { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } }
      );
    }

    const body = await req.json();
    const parsed = orderCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Data pesanan tidak valid",
          issues: parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
          })),
        },
        { status: 400 }
      );
    }

    const { email, ...rest } = parsed.data;

    // Saat database aktif, berkas wajib tautan https hasil upload server.
    // data URL hanya sah di mode mock (Supabase mati) dan tidak boleh masuk
    // baris database: bisa berukuran puluhan MB dan membengkakkan tabel.
    if (adminSupabase && [rest.task_file_url, rest.payment_proof_url].some((u) => u?.startsWith("data:"))) {
      return NextResponse.json(
        { success: false, message: "Unggah berkas gagal, silakan coba lagi" },
        { status: 400 }
      );
    }

    const baseRow = {
      ...rest,
      ...recomputePrice(parsed.data),
      email: email || null,
      status: "pending_verification" as const,
    };

    let orderCode = generateOrderCode();

    if (adminSupabase) {
      let saved = false;

      for (let attempt = 0; attempt < CODE_ATTEMPTS && !saved; attempt++) {
        orderCode = generateOrderCode();
        const { error } = await adminSupabase.from("orders").insert([{ ...baseRow, order_code: orderCode }]);

        if (!error) {
          saved = true;
          break;
        }

        console.error("Supabase insert error:", error);
        // 23505 = order_code kembar, ulangi dengan kode baru
        if (error.code !== "23505") {
          return NextResponse.json(
            { success: false, message: "Gagal menyimpan pesanan, silakan coba lagi" },
            { status: 500 }
          );
        }
      }

      if (!saved) {
        return NextResponse.json(
          { success: false, message: "Gagal membuat kode pesanan unik, silakan coba lagi" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true, order_code: orderCode });
  } catch (err: unknown) {
    console.error("POST /api/orders error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
