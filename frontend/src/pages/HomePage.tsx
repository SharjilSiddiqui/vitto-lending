import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Calculator, IndianRupee, Send } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { businessTypeOptions } from "../constants/businessTypes";
import { Card } from "../components/Card";
import { InputField, SelectField, TextAreaField } from "../components/FormField";
import { ResultCard } from "../components/ResultCard";
import { useLendingDecision } from "../hooks/useLendingDecision";
import { formatCurrency } from "../utils/formatters";
import { lendingFormSchema, type LendingFormValues } from "../utils/validation";
import { getApiError } from "../services/api";

export function HomePage() {
  const decisionMutation = useLendingDecision();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<LendingFormValues>({
    resolver: zodResolver(lendingFormSchema),
    defaultValues: {
      ownerName: "",
      pan: "",
      businessType: "RETAIL",
      monthlyRevenue: 250000,
      loanAmount: 800000,
      tenureMonths: 24,
      purpose: ""
    }
  });

  const isProcessing = decisionMutation.isPending || isSubmitting;
  const monthlyRevenue = Number(watch("monthlyRevenue") || 0);
  const loanAmount = Number(watch("loanAmount") || 0);

  const onSubmit = (values: LendingFormValues) => {
    decisionMutation.mutate(values);
  };

  return (
    <main className="min-h-screen bg-surface">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <motion.header
          className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-primary">
              <Calculator className="size-4" />
              MSME lending decision engine
            </div>
            <h1 className="max-w-3xl text-4xl font-bold tracking-normal text-slate-950 sm:text-5xl">Vitto Lending Decision System</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Capture business and loan details, validate risk signals, and receive a scored lending decision with clear reason codes.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:min-w-80">
            <div className="rounded-2xl bg-white p-4 shadow-soft">
              <p className="text-xs font-semibold uppercase text-slate-500">Revenue</p>
              <p className="mt-1 truncate text-lg font-bold text-slate-950">{formatCurrency(monthlyRevenue)}</p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-soft">
              <p className="text-xs font-semibold uppercase text-slate-500">Loan Ask</p>
              <p className="mt-1 truncate text-lg font-bold text-slate-950">{formatCurrency(loanAmount)}</p>
            </div>
          </div>
        </motion.header>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-[1fr_420px]">
          <div className="grid gap-6">
            <Card title="Business Information" icon={<Building2 className="size-5" />}>
              <div className="grid gap-5 md:grid-cols-2">
                <InputField label="Business Owner Name" placeholder="Aarav Mehta" error={errors.ownerName} {...register("ownerName")} />
                <InputField label="PAN Number" placeholder="ABCDE1234F" error={errors.pan} {...register("pan")} />
                <SelectField label="Business Type" options={businessTypeOptions} error={errors.businessType} {...register("businessType")} />
                <InputField label="Monthly Revenue" type="number" min="1" step="1000" error={errors.monthlyRevenue} {...register("monthlyRevenue")} />
              </div>
            </Card>

            <Card title="Loan Information" icon={<IndianRupee className="size-5" />}>
              <div className="grid gap-5 md:grid-cols-2">
                <InputField label="Loan Amount" type="number" min="1" step="1000" error={errors.loanAmount} {...register("loanAmount")} />
                <InputField label="Loan Tenure" type="number" min="3" max="84" error={errors.tenureMonths} {...register("tenureMonths")} />
                <div className="md:col-span-2">
                  <TextAreaField label="Loan Purpose" placeholder="Working capital for seasonal inventory purchase" error={errors.purpose} {...register("purpose")} />
                </div>
              </div>
            </Card>

            {decisionMutation.isError ? (
              <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-danger">
                {getApiError(decisionMutation.error)}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isProcessing}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {isProcessing ? <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Send className="size-4" />}
              {isProcessing ? "Evaluating Application" : "Evaluate Application"}
            </button>
          </div>

          <aside className="lg:sticky lg:top-8 lg:self-start">
            <ResultCard result={decisionMutation.data?.result} isProcessing={isProcessing} />
          </aside>
        </form>
      </div>
    </main>
  );
}
