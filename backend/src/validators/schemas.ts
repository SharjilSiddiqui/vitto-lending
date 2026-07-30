import { z } from "zod";
import { sanitizePan, sanitizeString } from "../utils/sanitize.js";

const currencyAmount = z.coerce
  .number({ invalid_type_error: "Must be a valid number" })
  .finite("Must be a finite number")
  .positive("Must be greater than zero")
  .max(999_999_999, "Value is too large");

export const businessSchema = z.object({
  ownerName: z
    .string()
    .transform(sanitizeString)
    .pipe(z.string().min(2, "Owner name must be at least 2 characters").max(100, "Owner name is too long")),
  pan: z
    .string()
    .transform(sanitizePan)
    .pipe(z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "PAN must match ABCDE1234F")),
  businessType: z.enum(["RETAIL", "MANUFACTURING", "SERVICES", "HEALTHCARE", "TECHNOLOGY", "EDUCATION", "AGRICULTURE"]),
  monthlyRevenue: currencyAmount
});

export const loanSchema = z.object({
  businessId: z.string().min(1, "Business id is required"),
  loanAmount: currencyAmount,
  tenureMonths: z.coerce
    .number({ invalid_type_error: "Tenure must be a valid number" })
    .int("Tenure must be a whole number")
    .min(3, "Tenure must be at least 3 months")
    .max(84, "Tenure cannot exceed 84 months"),
  purpose: z
    .string()
    .transform(sanitizeString)
    .pipe(z.string().min(3, "Purpose must be at least 3 characters").max(180, "Purpose is too long"))
});

export const decisionSchema = z.object({
  businessId: z.string().min(1, "Business id is required"),
  loanId: z.string().min(1, "Loan id is required")
});

export type BusinessInput = z.infer<typeof businessSchema>;
export type LoanInput = z.infer<typeof loanSchema>;
export type DecisionInput = z.infer<typeof decisionSchema>;
