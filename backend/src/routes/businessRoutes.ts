import { Router } from "express";
import { createBusinessController } from "../controllers/businessController.js";
import { validateBody } from "../middleware/validate.js";
import { businessSchema } from "../validators/schemas.js";

export const businessRoutes = Router();

/**
 * @openapi
 * /api/business:
 *   post:
 *     summary: Create a business profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ownerName, pan, businessType, monthlyRevenue]
 *             properties:
 *               ownerName:
 *                 type: string
 *                 example: Aarav Mehta
 *               pan:
 *                 type: string
 *                 example: ABCDE1234F
 *               businessType:
 *                 type: string
 *                 enum: [RETAIL, MANUFACTURING, SERVICES, HEALTHCARE, TECHNOLOGY, EDUCATION, AGRICULTURE]
 *               monthlyRevenue:
 *                 type: number
 *                 example: 250000
 *     responses:
 *       201:
 *         description: Business profile created
 *       400:
 *         description: Validation failed
 */
businessRoutes.post("/", validateBody(businessSchema), createBusinessController);
