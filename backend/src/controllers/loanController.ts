import type { Request, Response } from "express";
import { createLoan } from "../services/loanService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import type { LoanInput } from "../validators/schemas.js";

export async function createLoanController(req: Request, res: Response): Promise<void> {
  const loan = await createLoan(req.body as LoanInput);
  sendSuccess(res, loan, 201);
}
