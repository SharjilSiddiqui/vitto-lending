import { prisma } from "../lib/prisma.js";
import type { DecisionResult, JobStatus } from "../types/api.js";
import { AppError } from "../utils/errors.js";
import type { DecisionInput } from "../validators/schemas.js";
import { evaluateCredit } from "./scoringService.js";

type DecisionJob = {
  id: string;
  status: JobStatus;
  createdAt: string;
  completedAt?: string;
  result?: DecisionResult;
  error?: string;
};

const jobs = new Map<string, DecisionJob>();

function makeJobId(): string {
  return `job_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export async function startDecisionJob(input: DecisionInput, ip: string): Promise<DecisionJob> {
  const loan = await prisma.loanApplication.findFirst({
    where: { id: input.loanId, businessId: input.businessId },
    include: { business: true }
  });

  if (!loan) {
    throw new AppError("Loan application not found for this business", 404);
  }

  const job: DecisionJob = {
    id: makeJobId(),
    status: "pending",
    createdAt: new Date().toISOString()
  };
  jobs.set(job.id, job);

  setTimeout(() => {
    void processDecision(job.id, input, ip);
  }, 1200);

  return job;
}

export function getDecisionJob(jobId: string): DecisionJob {
  const job = jobs.get(jobId);

  if (!job) {
    throw new AppError("Decision job not found", 404);
  }

  return job;
}

async function processDecision(jobId: string, input: DecisionInput, ip: string): Promise<void> {
  const job = jobs.get(jobId);
  if (!job) return;

  job.status = "processing";

  try {
    const loan = await prisma.loanApplication.findFirstOrThrow({
      where: { id: input.loanId, businessId: input.businessId },
      include: { business: true }
    });

    const result = evaluateCredit({
      monthlyRevenue: Number(loan.business.monthlyRevenue),
      loanAmount: Number(loan.loanAmount),
      tenureMonths: loan.tenureMonths
    });

    await prisma.$transaction([
      prisma.decision.create({
        data: {
          loanId: loan.id,
          creditScore: result.creditScore,
          decision: result.decision,
          reasonCodes: result.reasonCodes
        }
      }),
      prisma.auditLog.create({
        data: {
          request: input,
          decision: result.decision,
          score: result.creditScore,
          ip
        }
      })
    ]);

    jobs.set(jobId, {
      ...job,
      status: "completed",
      completedAt: new Date().toISOString(),
      result
    });
  } catch {
    jobs.set(jobId, {
      ...job,
      status: "failed",
      completedAt: new Date().toISOString(),
      error: "Decision processing failed"
    });
  }
}
