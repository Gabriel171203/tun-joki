"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { OrderFormData, OrderRecord, ServiceCategory, TaskDifficulty } from "@/types/order";
import { calculateOrderPricing, generateOrderCode } from "@/lib/utils";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { uploadFileToStorage } from "@/lib/supabase/client";
import { saveOrder } from "@/lib/orders-store";
import { StepTaskDetails } from "@/components/order/step-task-details";
import { StepQrisPayment } from "@/components/order/step-qris-payment";
import { StepProofUpload } from "@/components/order/step-proof-upload";
import { StepSuccessWhatsApp } from "@/components/order/step-success-whatsapp";
import { Check, QrCode, FileText, Upload, MessageSquare, AlertCircle } from "lucide-react";

function OrderWizardContent() {
  const searchParams = useSearchParams();

  // Read pre-filled query parameters from Calculator / Services
  const initialCategory = (searchParams.get("category") as ServiceCategory) || "it_dev";
  const initialDifficulty = (searchParams.get("difficulty") as TaskDifficulty) || "medium";
  const initialHours = parseInt(searchParams.get("hours") || "48", 10);

  const defaultDeadlineDate = new Date(Date.now() + initialHours * 3600 * 1000)
    .toISOString()
    .split("T")[0];

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<OrderRecord | null>(null);

  const [formData, setFormData] = useState<OrderFormData>({
    client_name: "",
    is_anonymous: false,
    whatsapp: "",
    email: "",
    education_level: "S1",
    service_category: initialCategory,
    task_title: "",
    task_description: "",
    deadline_date: defaultDeadlineDate,
    deadline_time: "21:00",
    difficulty: initialDifficulty,
    task_file: null,
  });

  const currentCategoryConfig =
    SERVICE_CATEGORIES.find((c) => c.id === formData.service_category) || SERVICE_CATEGORIES[0];
  const isConsultationFlow = currentCategoryConfig.flowType === "consultation";

  // Calculate pricing based on current category, difficulty, and selected deadline
  const calculateHoursFromDeadline = () => {
    try {
      const deadlineTarget = new Date(`${formData.deadline_date}T${formData.deadline_time}:00`);
      const now = new Date();
      const diffMs = deadlineTarget.getTime() - now.getTime();
      const diffHours = Math.max(12, Math.round(diffMs / (1000 * 60 * 60)));
      return diffHours;
    } catch {
      return 48;
    }
  };

  const currentDeadlineHours = calculateHoursFromDeadline();
  const pricing = calculateOrderPricing(
    formData.service_category,
    formData.difficulty,
    currentDeadlineHours
  );

  const handleNextToStep2 = () => {
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextToStep3 = () => {
    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToStep1 = () => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToStep2 = () => {
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handler khusus alur konsultasi (Coding & Skripsi)
  const handleConsultationSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      let taskFileUrl: string | undefined = undefined;
      let taskFileName: string | undefined = undefined;

      if (formData.task_file) {
        try {
          const taskUpload = await uploadFileToStorage(formData.task_file, "task-files");
          taskFileUrl = taskUpload.url;
          taskFileName = taskUpload.fileName;
        } catch (e) {
          console.warn("Upload task file error:", e);
        }
      }

      const orderCode = generateOrderCode();
      const deadlineIso = new Date(`${formData.deadline_date}T${formData.deadline_time}:00`).toISOString();

      const newOrder: OrderRecord = {
        id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `order-${Date.now()}`,
        order_code: orderCode,
        client_name: formData.client_name,
        is_anonymous: formData.is_anonymous,
        whatsapp: formData.whatsapp,
        email: formData.email,
        education_level: formData.education_level,
        service_category: formData.service_category,
        task_title: formData.task_title,
        task_description: formData.task_description,
        deadline_date: deadlineIso,
        difficulty: formData.difficulty,
        estimated_price: 0, // Ditentukan setelah diskusi admin
        dp_amount: 0,
        task_file_url: taskFileUrl,
        task_file_name: taskFileName || formData.task_file?.name,
        status: "pending_verification",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const saved = await saveOrder(newOrder);
      setCreatedOrder(saved.orderCode ? { ...newOrder, order_code: saved.orderCode } : newOrder);

      setStep(4);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Consultation submit failed:", err);
      setSubmitError(
        "Terjadi kesalahan saat memproses data. Anda tetap dapat langsung menghubungi WhatsApp admin."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler alur checkout instan QRIS (Media & Presentasi)
  const handleFinalSubmit = async (proofFile: File) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      let taskFileUrl: string | undefined = undefined;
      let taskFileName: string | undefined = undefined;

      if (formData.task_file) {
        try {
          const taskUpload = await uploadFileToStorage(formData.task_file, "task-files");
          taskFileUrl = taskUpload.url;
          taskFileName = taskUpload.fileName;
        } catch (e) {
          console.warn("Upload task file error:", e);
        }
      }

      const proofUpload = await uploadFileToStorage(proofFile, "payment-proofs");
      const paymentProofUrl = proofUpload.url;

      const orderCode = generateOrderCode();
      const deadlineIso = new Date(`${formData.deadline_date}T${formData.deadline_time}:00`).toISOString();

      const newOrder: OrderRecord = {
        id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `order-${Date.now()}`,
        order_code: orderCode,
        client_name: formData.client_name,
        is_anonymous: formData.is_anonymous,
        whatsapp: formData.whatsapp,
        email: formData.email,
        education_level: formData.education_level,
        service_category: formData.service_category,
        task_title: formData.task_title,
        task_description: formData.task_description,
        deadline_date: deadlineIso,
        difficulty: formData.difficulty,
        estimated_price: pricing.totalPrice,
        dp_amount: pricing.dpAmount,
        task_file_url: taskFileUrl,
        task_file_name: taskFileName || formData.task_file?.name,
        payment_proof_url: paymentProofUrl,
        status: "pending_verification",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const saved = await saveOrder(newOrder);

      setCreatedOrder(saved.orderCode ? { ...newOrder, order_code: saved.orderCode } : newOrder);
      setStep(4);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Submission failed:", err);
      setSubmitError(
        "Terjadi kesalahan saat memproses pesanan. Silakan coba lagi atau langsung hubungi admin via WhatsApp."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsList = isConsultationFlow
    ? [
        { num: 1, label: "Brief Tugas", icon: FileText },
        { num: 4, label: "Chat WA Admin", icon: MessageSquare },
      ]
    : [
        { num: 1, label: "Detail Tugas", icon: FileText },
        { num: 2, label: "Scan QRIS & DP", icon: QrCode },
        { num: 3, label: "Upload Bukti", icon: Upload },
        { num: 4, label: "Konfirmasi WA", icon: MessageSquare },
      ];

  return (
    <div className="py-12 md:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Wizard Header Stepper */}
      <div className="mb-10">
        <div className="flex items-center justify-between max-w-xl mx-auto relative">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-earth-200 -z-10" />

          {stepsList.map((s, idx) => {
            const isCompleted = step > s.num || (isConsultationFlow && step === 4 && s.num === 1);
            const isCurrent = step === s.num;
            const IconComponent = s.icon;

            return (
              <div key={idx} className="flex flex-col items-center" aria-current={isCurrent ? "step" : undefined}>
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-300 shadow-sm ${
                    isCompleted
                      ? "bg-emerald-600 text-white"
                      : isCurrent
                      ? "bg-terracotta-500 text-white ring-4 ring-terracotta-100"
                      : "bg-white text-earth-600 border-2 border-earth-500"
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : <IconComponent className="w-5 h-5" />}
                </div>
                <span
                  className={`text-[11px] font-bold mt-2 hidden sm:block ${
                    isCurrent ? "text-navy-950" : "text-earth-600"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Step Card Container */}
      <div className="bg-white rounded-[2.5rem] border-2 border-earth-200 p-6 sm:p-10 md:p-12 shadow-warm-lg">
        {submitError && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-2xl border border-red-300 bg-red-50 px-4 py-3.5 text-sm text-red-700"
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
            <p className="font-medium">{submitError}</p>
          </div>
        )}

        {step === 1 && (
          <StepTaskDetails
            formData={formData}
            setFormData={setFormData}
            onNext={handleNextToStep2}
            onConsultation={handleConsultationSubmit}
            isSubmitting={isSubmitting}
          />
        )}

        {step === 2 && !isConsultationFlow && (
          <StepQrisPayment
            formData={formData}
            pricing={pricing}
            onNext={handleNextToStep3}
            onBack={handleBackToStep1}
          />
        )}

        {step === 3 && !isConsultationFlow && (
          <StepProofUpload
            formData={formData}
            setFormData={setFormData}
            pricing={pricing}
            onBack={handleBackToStep2}
            onSubmit={handleFinalSubmit}
            isSubmitting={isSubmitting}
          />
        )}

        {step === 4 && createdOrder && (
          <StepSuccessWhatsApp order={createdOrder} />
        )}
      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-terracotta-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-earth-700">Menyiapkan Form Pemesanan...</p>
          </div>
        </div>
      }
    >
      <OrderWizardContent />
    </Suspense>
  );
}
