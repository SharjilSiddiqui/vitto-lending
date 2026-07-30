import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import type { Express } from "express";
import { env } from "../config/env.js";

export function applySecurity(app: Express): void {
  app.use(helmet());
  app.use(
    cors({
      origin(origin, callback) {
        const allowed = [env.FRONTEND_ORIGIN.replace(/\/$/, "")];

        if (!origin || allowed.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    }),
  );
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 100,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );
}
