import { z } from "zod";

const amountSchema = z.coerce
  .number({ invalid_type_error: "Enter a valid number" })
  .finite("Enter a valid number")
  .positive("Must be greater than zero")
  .max(999_999_999, "Value is too large");

export const lendingFormSchema = z.object({
  ownerName: z.string().trim().min(2, "Enter at least 2 characters").max(100, "Name is too long"),
  pan: z
    .string()
    .trim()
    .transform((value) => value.toUpperCase())
    .pipe(z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "PAN must match ABCDE1234F")),
  businessType: z.enum(["RETAIL", "MANUFACTURING", "SERVICES", "HEALTHCARE", "TECHNOLOGY", "EDUCATION", "AGRICULTURE"]),
  monthlyRevenue: amountSchema,
  loanAmount: amountSchema,
  tenureMonths: z.coerce.number().int("Use whole months").min(3, "Minimum tenure is 3 months").max(84, "Maximum tenure is 84 months"),
  purpose: z.string().trim().min(3, "Enter a clear purpose").max(180, "Purpose is too long")
});

export type LendingFormValues = z.infer<typeof lendingFormSchema>;
