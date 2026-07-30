# MSME Lending Decision System Architecture

## Architecture Decisions

The system is split into a React frontend and an Express backend because the assessment calls for independent Vercel and Render deployments. The frontend owns interaction quality, validation feedback, and decision polling. The backend owns authoritative validation, persistence, scoring, audit logging, and API consistency.

The backend follows a layered structure:

- Routes define URL shape only.
- Controllers translate HTTP requests into service calls.
- Validators enforce request schemas with Zod.
- Services contain business logic, persistence orchestration, and the credit engine.
- Middleware centralizes security, validation, 404s, and error responses.

Prisma is used as the database boundary to keep schema evolution explicit and deployment-friendly. PostgreSQL is the right fit because the domain is relational: businesses own loan applications, loan applications own decisions, and audit logs need durable storage.

## Tradeoffs

The decision endpoint simulates background processing with an in-memory job store and `setTimeout`. This satisfies the async API contract while keeping the assessment deployable without adding Redis, BullMQ, or a worker service. In a real multi-instance Render deployment, the job store should move to Redis or PostgreSQL so polling remains stable across restarts and horizontal scaling.

The frontend creates the business and loan application before starting a decision. This keeps APIs composable and auditable, but it means duplicate PAN submissions are rejected by the backend unique constraint. A production system could expose an upsert or draft application endpoint depending on onboarding requirements.

## Decision Logic

The credit score starts at `700`. Revenue, loan-to-revenue ratio, EMI affordability, and tenure adjust the score. The result is clamped to `300-900`.

Fraud detection has priority: if `loanAmount / monthlyRevenue` is greater than `50`, the application is immediately rejected with `DATA_INCONSISTENCY`. This avoids presenting a normal score for an obviously invalid or manipulated application.

Applications with scores of `700` or higher are approved. Applications below `700` are rejected. Reason codes are attached to both positive and negative signals so the result is explainable.

## Validation Strategy

Validation is duplicated intentionally. The frontend uses React Hook Form and Zod for fast inline feedback. The backend uses Zod again as the source of enforcement because client-side validation can be bypassed.

The validation rules handle required fields, PAN format, empty strings, non-numeric values, negative numbers, zero values, tenure bounds, and oversized numeric payloads. Express also limits JSON body size to reduce abuse from large payloads.

## Future Improvements

The next production step would be durable job processing with Redis or a queue, authenticated users, richer audit trails, automated tests, and underwriting override workflows. The scoring model could also expand to include bureau data, bank statement cash flow, GST filings, sector-specific risk, and repayment history.
