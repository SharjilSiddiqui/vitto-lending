import { motion } from "framer-motion";
import { CheckCircle2, Clock3, ShieldCheck, XCircle } from "lucide-react";
import type { DecisionResult } from "../types/api";
import { formatDateTime, humanizeReason } from "../utils/formatters";

type ResultCardProps = {
  result?: DecisionResult;
  isProcessing: boolean;
};

export function ResultCard({ result, isProcessing }: ResultCardProps) {
  if (isProcessing) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex items-center gap-3 text-slate-700">
          <Clock3 className="size-5 animate-spin text-primary" />
          <span className="font-medium">Processing credit decision</span>
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: "8%" }}
            animate={{ width: "92%" }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          />
        </div>
      </section>
    );
  }

  if (!result) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-slate-500">
        <div className="flex items-center gap-3">
          <ShieldCheck className="size-5 text-primary" />
          <span className="font-medium">Decision output will appear here.</span>
        </div>
      </section>
    );
  }

  const approved = result.decision === "APPROVED";

  return (
    <motion.section
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${approved ? "bg-green-50 text-success" : "bg-red-50 text-danger"}`}>
            {approved ? <CheckCircle2 className="size-4" /> : <XCircle className="size-4" />}
            {result.decision}
          </div>
          <p className="mt-4 text-sm text-slate-500">Timestamp</p>
          <p className="font-medium text-slate-900">{formatDateTime(result.timestamp)}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-6 py-4 text-center">
          <p className="text-sm font-medium text-slate-500">Credit Score</p>
          <p className="mt-1 text-5xl font-bold text-slate-950">{result.creditScore}</p>
        </div>
      </div>
      <div className="mt-6">
        <p className="text-sm font-semibold text-slate-700">Reason Codes</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {result.reasonCodes.map((code) => (
            <span key={code} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
              {humanizeReason(code)}
            </span>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
