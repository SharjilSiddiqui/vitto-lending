import { Router } from "express";
import { sendSuccess } from "../utils/apiResponse.js";

export const healthRoutes = Router();

/**
 * @openapi
 * /api/health:
 *   get:
 *     summary: Health check
 *     responses:
 *       200:
 *         description: API is healthy
 */
healthRoutes.get("/", (_req, res) => {
  sendSuccess(res, { status: "ok" });
});
