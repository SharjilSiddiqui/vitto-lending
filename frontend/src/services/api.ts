import axios, { AxiosError } from "axios";
import type {
  ApiResponse,
  Business,
  BusinessPayload,
  DecisionJob,
  LoanApplication,
  LoanPayload
} from "../types/api";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api",
  timeout: 12000,
  headers: {
    "Content-Type": "application/json"
  }
});

function unwrap<T>(response: { data: ApiResponse<T> }): T {
  if (response.data.success) {
    return response.data.data;
  }

  throw new Error(response.data.message);
}

export function getApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiResponse<unknown> | undefined;
    if (data && !data.success) {
      const firstError = data.errors?.[0]?.message;
      return firstError ? `${data.message}: ${firstError}` : data.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}

export async function createBusiness(payload: BusinessPayload): Promise<Business> {
  return unwrap(await api.post<ApiResponse<Business>>("/business", payload));
}

export async function createLoan(payload: LoanPayload): Promise<LoanApplication> {
  return unwrap(await api.post<ApiResponse<LoanApplication>>("/loan", payload));
}

export async function startDecision(payload: { businessId: string; loanId: string }) {
  return unwrap(await api.post<ApiResponse<{ jobId: string; status: DecisionJob["status"]; createdAt: string }>>("/decision", payload));
}

export async function getDecisionJob(jobId: string): Promise<DecisionJob> {
  return unwrap(await api.get<ApiResponse<DecisionJob>>(`/decision/${jobId}`));
}
