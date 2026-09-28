import type { FeedbackCategory } from "@/lib/validations/feedback";

// Bentuk baris tabel public.feedback (lihat supabase/schema.sql bagian 5).
export interface FeedbackRecord {
  id: string;
  category: FeedbackCategory;
  name: string | null;
  email: string | null;
  message: string;
  page_source: string | null;
  created_at: string;
}
