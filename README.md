# Vitto MSME Lending Decision System

A production-quality full-stack application for MSME loan intake and automated lending decisions. The system captures business and loan details, validates risky inputs, persists the application, runs an async credit decision job, and returns a score, decision, reason codes, and timestamp.

## Overview

The product is built as a deployable fintech dashboard backed by an Express API and PostgreSQL database. It is intentionally modular: controllers handle HTTP, validators own request shape, services own business logic, Prisma owns persistence, and the frontend consumes the API through typed service functions.

## Architecture

- `frontend`: React 19, Vite, TypeScript, TailwindCSS, React Hook Form, Zod, TanStack Query, Axios, Framer Motion, Lucide Icons.
- `backend`: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, Zod, Helmet, Morgan, rate limiting, CORS, dotenv, Swagger.
- `database`: PostgreSQL locally through Docker, Neon PostgreSQL in production.
- `decision flow`: create business, create loan, start decision job, poll job status until completed.

## Tech Stack

Frontend: React 19, Vite, TypeScript, TailwindCSS, React Hook Form, Zod, Axios, TanStack Query, Framer Motion, Lucide Icons.

Backend: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, Zod, Helmet, Morgan, Express Rate Limit, CORS, dotenv.

Deployment: Vercel for frontend, Render for backend, Neon PostgreSQL for database.

## Setup

```bash
npm run install:all
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
docker compose up -d postgres
npm run prisma:generate --prefix backend
npm run prisma:migrate --prefix backend
npm run dev
```

Frontend runs on `http://localhost:5173`. Backend runs on `http://localhost:4000`.

## Environment Variables

Backend:

```bash
DATABASE_URL=postgresql://vitto:vitto@localhost:5432/vitto_lending?schema=public
PORT=4000
FRONTEND_ORIGIN=http://localhost:5173
NODE_ENV=development
```

Frontend:

```bash
VITE_API_URL=http://localhost:4000/api
```

## Database Setup

The Prisma schema defines:

- `Business`: owner profile, PAN, business type, monthly revenue.
- `LoanApplication`: linked loan request with amount, tenure, and purpose.
- `Decision`: score, approved or rejected decision, and reason codes.
- `AuditLog`: request payload, decision, score, timestamp, and IP address.

Run migrations with:

```bash
npm run prisma:migrate --prefix backend
```

Deploy migrations in production with:

```bash
npm run prisma:deploy --prefix backend
```

## API Endpoints

- `GET /api/health`: returns `{ "success": true, "data": { "status": "ok" } }`.
- `POST /api/business`: creates a business profile.
- `POST /api/loan`: creates a loan application for a business.
- `POST /api/decision`: starts async decision processing and returns a `jobId`.
- `GET /api/decision/:jobId`: returns job status and final result when completed.
- `GET /api/docs`: Swagger UI.

All endpoints use the same response envelope:

```json
{ "success": true, "data": {} }
```

```json
{ "success": false, "message": "Validation failed", "errors": [] }
```

## Decision Logic

The credit engine starts at `700`, then applies revenue, loan ratio, EMI affordability, and tenure adjustments. Scores are clamped between `300` and `900`.

Fraud detection rejects immediately when `loanAmount > 50 * monthlyRevenue` with `DATA_INCONSISTENCY`.

Applications with a final score of `700` or higher are approved. All others are rejected.

## Reason Codes

- `LOW_REVENUE`
- `HIGH_LOAN_RATIO`
- `HIGH_EMI`
- `SHORT_TENURE`
- `LONG_TENURE`
- `DATA_INCONSISTENCY`
- `GOOD_REVENUE`
- `GOOD_RATIO`
- `LOW_RISK`

## Deployment

Frontend on Vercel:

- Set `VITE_API_URL` to the Render backend URL plus `/api`.
- Build command: `npm run build`.
- Output directory: `dist`.

Backend on Render:

- Root directory: `backend`.
- Build command: `npm ci && npx prisma generate && npm run build`.
- Start command: `npm run prisma:deploy && npm start`.
- Set `DATABASE_URL`, `FRONTEND_ORIGIN`, `PORT`, and `NODE_ENV`.

Database on Neon:

- Create a PostgreSQL database.
- Copy the pooled or direct connection string into `DATABASE_URL`.
- Run `npm run prisma:deploy --prefix backend`.

## Folder Structure

```text
frontend/src/components
frontend/src/pages
frontend/src/hooks
frontend/src/services
frontend/src/types
frontend/src/utils
frontend/src/constants
backend/src/controllers
backend/src/routes
backend/src/services
backend/src/middleware
backend/src/validators
backend/src/lib
backend/src/utils
backend/src/types
backend/src/config
backend/prisma
```

## Docker

Run PostgreSQL and the backend:

```bash
docker compose up --build
```

For local frontend development, run:

```bash
npm run dev --prefix frontend
```

## Future Improvements

- Persist decision jobs in Redis or PostgreSQL for multi-instance deployments.
- Add authentication, RBAC, and maker-checker review for high-value loans.
- Add explainability weights to reason codes for underwriting teams.
- Introduce bureau, GST, and bank-statement integrations.
- Add automated API and UI test suites in CI.
