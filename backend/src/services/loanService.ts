import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/errors.js";
import type { LoanInput } from "../validators/schemas.js";

export async function createLoan(input: LoanInput) {
  const business = await prisma.business.findUnique({ where: { id: input.businessId } });

  if (!business) {
    throw new AppError("Business profile not found", 404);
  }

  return prisma.loanApplication.create({
    data: input
  });
}
