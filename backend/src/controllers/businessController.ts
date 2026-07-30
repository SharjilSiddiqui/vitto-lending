import type { Request, Response } from "express";
import { sendSuccess } from "../utils/apiResponse.js";
import { createBusiness } from "../services/businessService.js";
import type { BusinessInput } from "../validators/schemas.js";

export async function createBusinessController(req: Request, res: Response): Promise<void> {
  const business = await createBusiness(req.body as BusinessInput);
  sendSuccess(res, business, 201);
}
