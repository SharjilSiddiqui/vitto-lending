import { prisma } from "../lib/prisma.js";
import type { BusinessInput } from "../validators/schemas.js";

export async function createBusiness(input: BusinessInput) {
  return prisma.business.upsert({
    where: {
      pan: input.pan,
    },
    update: {
      ownerName: input.ownerName,
      businessType: input.businessType,
      monthlyRevenue: input.monthlyRevenue,
    },
    create: {
      ownerName: input.ownerName,
      pan: input.pan,
      businessType: input.businessType,
      monthlyRevenue: input.monthlyRevenue,
    },
  });
}
