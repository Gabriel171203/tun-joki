import { NextRequest, NextResponse } from "next/server";
import { adminFeedbackQuerySchema } from "@/lib/validations/feedback";
import { adminSupabase } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  try {
    const denied = await requireAdmin(req);
    if (denied) return denied;

    const { searchParams } = new URL(req.url);
    const parsed = adminFeedbackQuerySchema.safeParse({
      limit: searchParams.get("limit") ?? undefined,
    });
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Parameter tidak valid",
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
        { success: false, message: "Database belum dikonfigurasi" },
        { status: 503 }
      );
    }

    const { data, error, count } = await adminSupabase
      .from("feedback")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(parsed.data.limit);

    if (error) {
      console.error("Supabase feedback list error:", error);
      return NextResponse.json(
        { success: false, message: "Gagal memuat masukan" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, feedback: data ?? [], total: count ?? 0 });
  } catch (err: unknown) {
    console.error("GET /api/admin/feedback error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
