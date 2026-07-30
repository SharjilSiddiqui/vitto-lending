import { Router } from "express";
import { businessRoutes } from "./businessRoutes.js";
import { decisionRoutes } from "./decisionRoutes.js";
import { healthRoutes } from "./healthRoutes.js";
import { loanRoutes } from "./loanRoutes.js";

export const apiRoutes = Router();

apiRoutes.use("/health", healthRoutes);
apiRoutes.use("/business", businessRoutes);
apiRoutes.use("/loan", loanRoutes);
apiRoutes.use("/decision", decisionRoutes);
