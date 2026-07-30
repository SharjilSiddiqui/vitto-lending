import express from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import { apiRoutes } from "./routes/index.js";
import { applySecurity } from "./middleware/security.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
//
export function createApp() {
  const app = express();

  applySecurity(app);
  app.use(express.json({ limit: "24kb" }));
  app.use(morgan("combined"));
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use("/api", apiRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
