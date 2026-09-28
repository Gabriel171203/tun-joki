import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { adminListQuerySchema } from "@/lib/validations/order";
import { adminSupabase } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    const { searchParams } = new URL(req.url);
    const parsed = adminListQuerySchema.safeParse({
      status: searchParams.get("status") ?? undefined,
      q: searchParams.get("q") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
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
        { success: false, error: "Supabase belum dikonfigurasi" },
        { status: 503 }
      );
    }

    const { status, q, limit } = parsed.data;

    let query = adminSupabase
      .from("orders")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq("status", status);
    }
    if (q) {
      query = query.or(`order_code.ilike.%${q}%,client_name.ilike.%${q}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Admin list orders error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, orders: data ?? [], total: count ?? 0 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
