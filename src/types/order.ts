export type ServiceCategory = "it_dev" | "academic_doc" | "media_presentation";

export type EducationLevel = "SMA/SMK" | "D3" | "S1" | "S2" | "Umum";

export type TaskDifficulty = "easy" | "medium" | "hard";

export type DeadlineTier = "express_12h" | "fast_24h" | "standard_3d" | "relaxed_5d";

export type OrderStatus =
  | "pending_verification" // Menunggu konfirmasi bukti transfer
  | "in_progress"          // DP terverifikasi, tugas sedang dikerjakan
  | "review_ready"         // Draft tugas siap direview client
  | "revision"             // Dalam proses revisi
  | "completed"            // Pelunasan & tugas selesai
  | "cancelled";           // Dibatalkan

export interface OrderFormData {
  client_name: string;
  is_anonymous: boolean;
  whatsapp: string;
  email?: string;
  education_level: EducationLevel;
  service_category: ServiceCategory;
  task_title: string;
  task_description: string;
  deadline_date: string;
  deadline_time: string;
  difficulty: TaskDifficulty;
  task_file?: File | null;
  task_file_url?: string;
  task_file_name?: string;
  payment_proof?: File | null;
  payment_proof_url?: string;
}

export interface OrderCalculation {
  basePrice: number;
  difficultyMultiplier: number;
  urgencyMultiplier: number;
  totalPrice: number;
  dpAmount: number; // 50%
  remainingAmount: number;
}

export interface OrderRecord {
  id: string;
  order_code: string;
  client_name: string;
  is_anonymous: boolean;
  whatsapp: string;
  email?: string;
  education_level: EducationLevel;
  service_category: ServiceCategory;
  task_title: string;
  task_description: string;
  deadline_date: string;
  difficulty: TaskDifficulty;
  estimated_price: number;
  dp_amount: number;
  task_file_url?: string;
  task_file_name?: string;
  payment_proof_url?: string;
  status: OrderStatus;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}
