export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiFailure = {
  success: false;
  message: string;
  errors?: Array<{ field?: string; message: string }>;
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

export type DecisionOutcome = "APPROVED" | "REJECTED";

export type DecisionResult = {
  creditScore: number;
  decision: DecisionOutcome;
  reasonCodes: ReasonCode[];
  timestamp: string;
};

export type JobStatus = "pending" | "processing" | "completed" | "failed";
