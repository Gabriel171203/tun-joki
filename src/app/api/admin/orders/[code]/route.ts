import { NextRequest, NextResponse, after } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { adminUpdateSchema, orderCodeSchema } from "@/lib/validations/order";
import { adminSupabase } from "@/lib/supabase/server";
import { sendOrderConfirmedEmail } from "@/lib/notifications/email";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    const { code } = await params;
    const parsedCode = orderCodeSchema.safeParse(code.trim().toUpperCase());
    if (!parsedCode.success) {
      return NextResponse.json(
        { success: false, message: "Format kode pesanan tidak valid" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const parsed = adminUpdateSchema.safeParse(body);
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

    const { data: before, error: beforeError } = await adminSupabase
      .from("orders")
      .select("status")
      .eq("order_code", parsedCode.data)
      .single();

    if (beforeError) {
      if (beforeError.code === "PGRST116") {
        return NextResponse.json(
          { success: false, message: "Pesanan tidak ditemukan" },
          { status: 404 }
        );
      }
      console.error("Admin fetch order error:", beforeError);
      return NextResponse.json({ success: false, error: beforeError.message }, { status: 500 });
    }

    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (parsed.data.status !== undefined) patch.status = parsed.data.status;
    if (parsed.data.admin_notes !== undefined) patch.admin_notes = parsed.data.admin_notes;

    const { data, error } = await adminSupabase
      .from("orders")
      .update(patch)
      .eq("order_code", parsedCode.data)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { success: false, message: "Pesanan tidak ditemukan" },
          { status: 404 }
        );
      }
      console.error("Admin update order error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const justConfirmed =
      parsed.data.status === "in_progress" &&
      before.status !== "in_progress" &&
      Boolean(data?.email);
    if (justConfirmed) {
      after(async () => {
        try {
          await sendOrderConfirmedEmail({
            to: data.email,
            clientName: data.client_name,
            orderCode: data.order_code,
          });
        } catch (err) {
          console.error("Email konfirmasi gagal dikirim:", err);
        }
      });
    }

    return NextResponse.json({ success: true, order: data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
