# Vitto MSME Lending Decision System

A production-ready full-stack lending application that automates MSME loan intake and credit decisioning. The system captures business information, validates loan requests, persists application data, asynchronously evaluates creditworthiness, and returns a credit score, decision status, reason codes, and timestamp.

---

## Live Demo

**Frontend:** https://vitto-lending-coral.vercel.app

**Backend API:** https://vitto-lending-production.up.railway.app

**Swagger Documentation:**
https://vitto-lending-production.up.railway.app/api/docs

---

# Features

- Business onboarding
- Loan application creation
- Automated credit scoring
- Async decision processing
- Decision reason codes
- PostgreSQL persistence
- Swagger API documentation
- Input validation using Zod
- Production-ready Docker deployment
- Health monitoring endpoint
- CORS protection
- Rate limiting
- Helmet security middleware
- Prisma ORM

---

# Architecture

```
React (Vercel)
        │
        ▼
Express API (Railway)
        │
        ▼
 Prisma ORM
        │
        ▼
 PostgreSQL (Supabase)
```

---

# Tech Stack

## Frontend

- React 19
- TypeScript
- Vite
- TailwindCSS
- React Hook Form
- Zod
- TanStack Query
- Axios
- Framer Motion
- Lucide React

## Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Swagger UI
- Helmet
- Morgan
- Express Rate Limit
- CORS

## Database

- PostgreSQL
- Supabase

## Deployment

- Frontend → Vercel
- Backend → Railway
- Database → Supabase
- Containerization → Docker

---

# Project Structure

```
frontend/
│── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   └── utils/

backend/
│── prisma/
│── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── validators/
│   ├── utils/
│   └── lib/
```

---

# Database Schema

## Business

Stores business details.

- Owner Name
- PAN
- Business Type
- Monthly Revenue

## LoanApplication

Stores loan requests.

- Loan Amount
- Tenure
- Purpose

## Decision

Stores lending decisions.

- Credit Score
- Approval Status
- Reason Codes

## AuditLog

Stores request audit history.

---

# Decision Logic

Initial score:

```
700
```

Adjustments are applied based on:

- Monthly revenue
- Loan-to-income ratio
- EMI affordability
- Loan tenure

Scores are clamped between

```
300–900
```

Automatic rejection occurs when

```
loanAmount > 50 × monthlyRevenue
```

Final decision

- Score ≥ 700 → Approved
- Score < 700 → Rejected

---

# API Endpoints

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| GET    | /api/health          | Health check        |
| POST   | /api/business        | Create business     |
| POST   | /api/loan            | Create loan         |
| POST   | /api/decision        | Start decision job  |
| GET    | /api/decision/:jobId | Get decision status |
| GET    | /api/docs            | Swagger UI          |

---

# Running Locally

```bash
git clone <repo>

cd backend

cp .env.example .env

npm install

npx prisma generate

npx prisma migrate dev

npm run dev
```

Frontend

```bash
cd frontend

cp .env.example .env

npm install

npm run dev
```

---

# Environment Variables

Backend

```env
DATABASE_URL=
PORT=4000
FRONTEND_ORIGIN=http://localhost:5173
NODE_ENV=development
```

Frontend

```env
VITE_API_URL=http://localhost:4000/api
```

---

# Production Deployment

## Backend (Railway)

Build

```bash
npm ci
npx prisma generate
npm run build
```

Start

```bash
npm run prisma:deploy
npm start
```

Required variables

- DATABASE_URL
- FRONTEND_ORIGIN
- NODE_ENV
- PORT

---

## Frontend (Vercel)

```
VITE_API_URL=https://vitto-lending-production.up.railway.app/api
```

---

## Database (Supabase)

Apply migrations

```bash
npx prisma migrate deploy
```

Generate Prisma client

```bash
npx prisma generate
```

---

# Security

- Helmet
- CORS
- Rate Limiting
- Zod Validation
- Prisma Parameterized Queries

---

# Challenges Faced

During deployment the following production issues were identified and resolved:

- Docker build configuration
- Railway deployment configuration
- Prisma migration setup
- Empty PostgreSQL database
- Supabase connection issues
- CORS configuration between Vercel and Railway
- Environment variable configuration
- Production deployment debugging

---

# Future Improvements

- Redis-backed job queue
- Authentication & RBAC
- Bureau integrations
- GST verification
- Bank statement analysis
- CI/CD pipeline
- Automated testing
- Explainable AI scoring

---

# Author

**Sharjil Siddiqui**

B.Tech Artificial Intelligence & Data Science

Full Stack Developer
