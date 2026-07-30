import type { Request, Response } from "express";
import { getDecisionJob, startDecisionJob } from "../services/decisionJobService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import type { DecisionInput } from "../validators/schemas.js";

export async function startDecisionController(req: Request, res: Response): Promise<void> {
  const job = await startDecisionJob(req.body as DecisionInput, req.ip ?? "unknown");
  sendSuccess(res, { jobId: job.id, status: job.status, createdAt: job.createdAt }, 202);
}

export function getDecisionController(req: Request, res: Response): void {
  const jobId = Array.isArray(req.params.jobId) ? req.params.jobId[0] : req.params.jobId;
  const job = getDecisionJob(jobId);
  sendSuccess(res, job);
}
