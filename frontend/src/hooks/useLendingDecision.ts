import { useMutation } from "@tanstack/react-query";
import { createBusiness, createLoan, getDecisionJob, getApiError, startDecision } from "../services/api";
import type { DecisionJob } from "../types/api";
import type { LendingFormValues } from "../utils/validation";

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

async function pollDecision(jobId: string): Promise<DecisionJob> {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const job = await getDecisionJob(jobId);

    if (job.status === "completed") {
      return job;
    }

    if (job.status === "failed") {
      throw new Error(job.error ?? "Decision processing failed");
    }

    await wait(900);
  }

  throw new Error("Decision processing timed out");
}

export function useLendingDecision() {
  return useMutation({
    mutationFn: async (values: LendingFormValues) => {
      const business = await createBusiness({
        ownerName: values.ownerName,
        pan: values.pan,
        businessType: values.businessType,
        monthlyRevenue: values.monthlyRevenue
      });

      const loan = await createLoan({
        businessId: business.id,
        loanAmount: values.loanAmount,
        tenureMonths: values.tenureMonths,
        purpose: values.purpose
      });

      const job = await startDecision({ businessId: business.id, loanId: loan.id });
      return pollDecision(job.jobId);
    },
    meta: {
      getErrorMessage: getApiError
    }
  });
}
