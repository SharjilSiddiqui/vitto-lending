import type { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { AppError } from "../utils/errors.js";
import { sendFailure } from "../utils/apiResponse.js";

export function notFoundHandler(req: Request, res: Response): void {
  sendFailure(res, `Route ${req.method} ${req.path} not found`, 404);
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (error instanceof AppError) {
    sendFailure(res, error.message, error.statusCode, error.errors);
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    sendFailure(res, "A record with this unique value already exists", 409);
    return;
  }

  sendFailure(res, "Internal server error", 500);
}
