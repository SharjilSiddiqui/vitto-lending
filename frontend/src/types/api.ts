export type BusinessType =
  | "RETAIL"
  | "MANUFACTURING"
  | "SERVICES"
  | "HEALTHCARE"
  | "TECHNOLOGY"
  | "EDUCATION"
  | "AGRICULTURE";

export type BusinessPayload = {
  ownerName: string;
  pan: string;
  businessType: BusinessType;
  monthlyRevenue: number;
};

export type LoanPayload = {
  businessId: string;
  loanAmount: number;
  tenureMonths: number;
  purpose: string;
};

export type Business = BusinessPayload & {
  id: string;
  createdAt: string;
};

export type LoanApplication = LoanPayload & {
  id: string;
  createdAt: string;
};

export type ReasonCode =
  | "LOW_REVENUE"
  | "HIGH_LOAN_RATIO"
  | "HIGH_EMI"
  | "SHORT_TENURE"
  | "LONG_TENURE"
  | "DATA_INCONSISTENCY"
  | "GOOD_REVENUE"
  | "GOOD_RATIO"
  | "LOW_RISK";

export type DecisionResult = {
  creditScore: number;
  decision: "APPROVED" | "REJECTED";
  reasonCodes: ReasonCode[];
  timestamp: string;
};

export type DecisionJob = {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: string;
  completedAt?: string;
  result?: DecisionResult;
  error?: string;
};

export type ApiResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      message: string;
      errors?: Array<{ field?: string; message: string }>;
    };
