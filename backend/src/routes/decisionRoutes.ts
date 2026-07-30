import { Router } from "express";
import { getDecisionController, startDecisionController } from "../controllers/decisionController.js";
import { validateBody } from "../middleware/validate.js";
import { decisionSchema } from "../validators/schemas.js";

export const decisionRoutes = Router();

/**
 * @openapi
 * /api/decision:
 *   post:
 *     summary: Start async credit decision processing
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [businessId, loanId]
 *             properties:
 *               businessId:
 *                 type: string
 *               loanId:
 *                 type: string
 *     responses:
 *       202:
 *         description: Decision job accepted
 *       404:
 *         description: Loan not found for business
 */
decisionRoutes.post("/", validateBody(decisionSchema), startDecisionController);

/**
 * @openapi
 * /api/decision/{jobId}:
 *   get:
 *     summary: Get decision job status
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Decision job status
 *       404:
 *         description: Decision job not found
 */
decisionRoutes.get("/:jobId", getDecisionController);
