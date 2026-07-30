import type { DecisionResult, ReasonCode } from "../types/api.js";

type ScoreInput = {
  monthlyRevenue: number;
  loanAmount: number;
  tenureMonths: number;
};

export function evaluateCredit(input: ScoreInput): DecisionResult {
  const reasonCodes: ReasonCode[] = [];
  const loanRatio = input.loanAmount / input.monthlyRevenue;
  const emi = input.loanAmount / input.tenureMonths;
  const revenueToEmi = input.monthlyRevenue / emi;
  let score = 700;

  if (loanRatio > 50) {
    return {
      creditScore: 300,
      decision: "REJECTED",
      reasonCodes: ["DATA_INCONSISTENCY"],
      timestamp: new Date().toISOString()
    };
  }

  if (input.monthlyRevenue < 50_000) {
    score -= 120;
    reasonCodes.push("LOW_REVENUE");
  } else if (input.monthlyRevenue < 200_000) {
    score += 10;
  } else if (input.monthlyRevenue < 500_000) {
    score += 40;
    reasonCodes.push("GOOD_REVENUE");
  } else {
    score += 70;
    reasonCodes.push("GOOD_REVENUE");
  }

  if (loanRatio <= 2) {
    score += 50;
    reasonCodes.push("GOOD_RATIO");
  } else if (loanRatio <= 5) {
    score += 20;
    reasonCodes.push("GOOD_RATIO");
  } else if (loanRatio <= 10) {
    score -= 40;
    reasonCodes.push("HIGH_LOAN_RATIO");
  } else {
    score -= 100;
    reasonCodes.push("HIGH_LOAN_RATIO");
  }

  if (revenueToEmi >= 5) {
    score += 40;
    reasonCodes.push("LOW_RISK");
  } else if (revenueToEmi >= 3) {
    score += 20;
  } else if (revenueToEmi < 2) {
    score -= 100;
    reasonCodes.push("HIGH_EMI");
  }

  if (input.tenureMonths >= 12 && input.tenureMonths <= 36) {
    score += 20;
  } else if (input.tenureMonths >= 37 && input.tenureMonths <= 60) {
    score -= 10;
    reasonCodes.push("LONG_TENURE");
  } else if (input.tenureMonths > 60) {
    score -= 30;
    reasonCodes.push("LONG_TENURE");
  } else {
    reasonCodes.push("SHORT_TENURE");
  }

  const creditScore = Math.min(900, Math.max(300, Math.round(score)));

  return {
    creditScore,
    decision: creditScore >= 700 ? "APPROVED" : "REJECTED",
    reasonCodes: [...new Set(reasonCodes)],
    timestamp: new Date().toISOString()
  };
}
