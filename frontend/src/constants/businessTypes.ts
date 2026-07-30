import type { BusinessType } from "../types/api";

export const businessTypeOptions: Array<{ value: BusinessType; label: string }> = [
  { value: "RETAIL", label: "Retail" },
  { value: "MANUFACTURING", label: "Manufacturing" },
  { value: "SERVICES", label: "Services" },
  { value: "HEALTHCARE", label: "Healthcare" },
  { value: "TECHNOLOGY", label: "Technology" },
  { value: "EDUCATION", label: "Education" },
  { value: "AGRICULTURE", label: "Agriculture" }
];
