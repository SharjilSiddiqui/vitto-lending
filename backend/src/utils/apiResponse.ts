import type { Response } from "express";
import type { ApiFailure, ApiSuccess } from "../types/api.js";

export function sendSuccess<T>(res: Response, data: T, status = 200): Response<ApiSuccess<T>> {
  return res.status(status).json({ success: true, data });
}

export function sendFailure(
  res: Response,
  message: string,
  status = 400,
  errors?: ApiFailure["errors"]
): Response<ApiFailure> {
  return res.status(status).json({ success: false, message, errors });
}
