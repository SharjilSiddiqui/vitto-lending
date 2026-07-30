import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Vitto MSME Lending API",
      version: "1.0.0",
      description: "Business onboarding, loan application, and async credit decision APIs."
    },
    servers: [{ url: "http://localhost:4000" }]
  },
  apis: ["./src/routes/*.ts"]
});
