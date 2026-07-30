import { Router } from "express";
import { createLoanController } from "../controllers/loanController.js";
import { validateBody } from "../middleware/validate.js";
import { loanSchema } from "../validators/schemas.js";

export const loanRoutes = Router();

/**
 * @openapi
 * /api/loan:
 *   post:
 *     summary: Create a loan application
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [businessId, loanAmount, tenureMonths, purpose]
 *             properties:
 *               businessId:
 *                 type: string
 *               loanAmount:
 *                 type: number
 *                 example: 800000
 *               tenureMonths:
 *                 type: integer
 *                 minimum: 3
 *                 maximum: 84
 *                 example: 24
 *               purpose:
 *                 type: string
 *                 example: Working capital
 *     responses:
 *       201:
 *         description: Loan application created
 *       404:
 *         description: Business not found
 */
loanRoutes.post("/", validateBody(loanSchema), createLoanController);
