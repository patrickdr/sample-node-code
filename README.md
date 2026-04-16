# sample-node

A lean reference REST API built with Node.js + Express + Prisma (MongoDB) to demonstrate clean architecture and design patterns.

## Patterns Showcased

- **Repository pattern** — all database access isolated behind repository classes
- **Factory pattern** — dependencies constructed via factories; no `new` in business logic
- **Service layer** — business logic fully decoupled from HTTP
- **IoC container** — single wiring point at startup; constructor injection throughout
- **Middleware chain** — auth, validation, and error handling as composable functions

## Stack

- **Runtime:** Node.js 20 LTS (ESM)
- **Framework:** Express 4
- **ORM:** Prisma 5 (MongoDB)
- **Auth:** JWT (`jsonwebtoken`) + `bcryptjs`
- **Validation:** Zod
- **Tests:** Jest + Supertest

## Getting Started

**Prerequisites:** Node.js 20+, a running MongoDB instance (local or Atlas)

```bash
# 1. Install dependencies
pnpm install   # or npm install

# 2. Configure environment
cp .env.example .env
# Edit .env — set DATABASE_URL and JWT_SECRET

# 3. Sync schema to MongoDB
npx prisma db push

# 4. Start dev server
pnpm dev
```

Server starts at `http://localhost:3000`. Verify with:

```bash
curl http://localhost:3000/health
# {"status":"ok"}
```

## Environment Variables

| Variable | Example | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Runtime environment |
| `PORT` | `3000` | HTTP port |
| `DATABASE_URL` | `mongodb://localhost:27017/sample-node` | MongoDB connection string |
| `JWT_SECRET` | _(random string)_ | Secret for signing JWTs |
| `JWT_EXPIRES_IN` | `7d` | JWT expiry duration |

## API

All endpoints are prefixed with `/api`. Protected routes require `Authorization: Bearer <token>`.

### Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/login` | — | Login, returns JWT |

### Users

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/users` | JWT | List all users |
| POST | `/api/users` | — | Register user |
| GET | `/api/users/:id` | JWT | Get user by ID |
| PUT | `/api/users/:id` | JWT | Update user |
| DELETE | `/api/users/:id` | JWT | Delete user |

### Roles

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/roles` | JWT | List all roles |
| POST | `/api/roles` | JWT | Create role |
| GET | `/api/roles/:id` | JWT | Get role by ID |
| PUT | `/api/roles/:id` | JWT | Update role |
| DELETE | `/api/roles/:id` | JWT | Delete role |

### User Roles

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/user-roles` | JWT | Assign role to user |
| DELETE | `/api/user-roles/:id` | JWT | Revoke role assignment |
| GET | `/api/user-roles/user/:userId` | JWT | List roles for a user |

### Example Flow

```bash
# Register
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"password123"}'
# → {"token":"eyJ..."}

# Use token
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer eyJ..."
```

## Project Structure

```
src/
├── config/env.js          # Zod-validated env — imported everywhere instead of process.env
├── container/index.js     # IoC wiring — only place new is called
├── errors/AppError.js     # AppError hierarchy (NotFound, Conflict, Unauthorized, Validation)
├── factories/             # Construct repo → service → controller per domain
├── repositories/          # All Prisma queries; base class with common CRUD
├── services/              # Business logic; receive repositories via constructor
├── controllers/           # HTTP in/out only; delegate to services
├── middlewares/           # auth (JWT), validate (Zod), error (global handler)
└── routes/                # Mount controllers; define Zod schemas per route
```

## Running Tests

```bash
pnpm test           # run all tests
pnpm test:watch     # watch mode
```

Tests use mocked repositories — no database required.
