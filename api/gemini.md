# CLAUDE.md - Balivio Backend API

> This document serves as the primary instruction file for AI coding assistants (Claude, Gemini, etc.)
> working on the Balivio Backend API project. Written in English for optimal AI processing.

---

## 1. Project Overview

- **Name**        : Balivio Backend API
- **Description** : RESTful API server for Balivio - a Bali villa search and booking platform. Standalone Express.js service acting as the data layer between Supabase PostgreSQL and the React/TanStack Start frontend.
- **Goal**        : Provide secure, performant, and well-structured API endpoints covering authentication, villa discovery, availability management, bookings, payments, reviews, and wishlists.
- **Target Users**: Balivio frontend app (React + TanStack Router) and future mobile clients.
- **Version**     : v0.1.0
- **Status**      : Active development

---

## 2. Tech Stack

- **Language**        : TypeScript (strict mode)
- **Runtime**         : Node.js (v20+)
- **Framework**       : Express.js v5
- **Database**        : PostgreSQL via Supabase (hosted)
- **DB Client**       : `@supabase/supabase-js` - use service-role key server-side only
- **ORM / Query**     : Drizzle ORM (type-safe queries, schema mirrors the DBML)
- **Validation**      : Zod (all request bodies and query params)
- **Auth Strategy**   : Custom JWT (access token + refresh token) - sessions stored in `user_sessions` table
- **Password Hashing**: bcryptjs
- **Middleware**      : cors, helmet, morgan, express-rate-limit
- **API Docs**        : Swagger / OpenAPI 3.0 via swagger-ui-express + zod-to-openapi
- **Testing**         : Vitest + Supertest
- **Package Manager** : npm
- **Deployment**      : Railway (recommended)

---

## 3. Commands

```bash
# Development
npm run dev            # Start dev server with hot-reload (tsx watch)
npm run build          # Compile TypeScript to dist/
npm run start          # Run compiled production build

# Code Quality
npm run lint           # Run ESLint
npm run format         # Prettier format
npm run type-check     # tsc --noEmit

# Database (Drizzle)
npm run db:generate    # Generate Drizzle migrations from schema
npm run db:migrate     # Apply pending migrations to Supabase
npm run db:seed        # Seed initial master data (areas, property_types, amenities)
npm run db:studio      # Open Drizzle Studio (DB browser)

# Testing
npm run test           # Run all tests
npm run test:unit      # Unit tests only
npm run test:e2e       # Integration / e2e tests (Supertest)
npm run test:cov       # Generate coverage report
```

> Never use bun or yarn in this project - always use npm.

---

## 4. Project Structure

Architecture: Layered architecture (Routes -> Controllers -> Services -> Repository/DB)

```
api/
  src/
    config/               # App config, env validation (Zod), Supabase client init
    db/
      schema/             # Drizzle schema files (one file per table group)
      migrations/         # Auto-generated Drizzle migration SQL files
      seed/               # Seed scripts for master data
    modules/              # Feature modules, grouped by layer
      router/
        authRouter.ts
        villasRouter.ts
        bookingsRouter.ts
        paymentsRouter.ts
        reviewsRouter.ts
        wishlistsRouter.ts
        areasRouter.ts
        usersRouter.ts
      controller/
        authController.ts
        villasController.ts
        bookingsController.ts
        paymentsController.ts
        reviewsController.ts
        wishlistsController.ts
        areasController.ts
        usersController.ts
      service/
        authService.ts
        villasService.ts
        bookingsService.ts
        paymentsService.ts
        reviewsService.ts
        wishlistsService.ts
        areasService.ts
        usersService.ts
      schema/
        authSchema.ts       # Zod schemas for auth endpoints
        villasSchema.ts
        bookingsSchema.ts
        paymentsSchema.ts
        reviewsSchema.ts
        usersSchema.ts
    middleware/
      authMiddleware.ts     # JWT verification, role guard
      validateMiddleware.ts # Zod request validation middleware
      errorMiddleware.ts    # Global error handler
      rateLimitMiddleware.ts # Per-route rate limiting
    utils/
      jwtUtils.ts           # Sign / verify access & refresh tokens
      hashUtils.ts          # bcrypt helpers
      responseUtils.ts      # Standardized API response builder
      bookingCodeUtils.ts   # Generate booking code (BK-YYYY-XXXX)
      paginationUtils.ts    # Offset pagination helpers
    types/
      express.d.ts          # Augment Express Request with req.user
      apiTypes.ts           # Shared types: ApiResponse<T>, PaginatedResponse<T>
    app.ts                  # Express app setup, middleware registration
    server.ts               # HTTP server entry point (listen)
  tests/
    unit/
    integration/
  .env.example
  .env                      # Never commit this
  drizzle.config.ts
  tsconfig.json
  package.json
  README.md
```

File placement rules:
- All route definitions go in modules/router/[name]Router.ts - never inline routes in app.ts
- Business logic goes in modules/service/[name]Service.ts - controllers only parse req/res
- Database queries stay in service/ (or a dedicated repository file for large services)
- Zod schemas for request/response go in modules/schema/[name]Schema.ts
- Shared types go in src/types/
- Do not create new top-level folders without confirmation

---

## 5. Naming Conventions

```
# Files & Folders
- File names       : camelCase                e.g., villasRouter.ts, authService.ts
- Folder names     : camelCase                e.g., modules/, userSessions/
- Test files       : [name].test.ts           e.g., authService.test.ts
- Type declaration : express.d.ts             (exception: .d.ts files use their standard name)

# Inside Code
- Variables        : camelCase                e.g., villaId, totalPrice
- Constants        : UPPER_SNAKE_CASE         e.g., JWT_SECRET, MAX_PAGE_SIZE
- Functions        : camelCase                e.g., getVillaById, createBooking
- Types/Interfaces : PascalCase               e.g., CreateBookingDto, VillaResponse
- Enums            : PascalCase               e.g., BookingStatus, PaymentMethod
- DB table fields  : snake_case               (mirrors PostgreSQL columns)
- API route paths  : kebab-case               e.g., /api/v1/property-types

# Git Branches
- Feature          : feat/[name]
- Bug fix          : fix/[name]
- Hotfix           : hotfix/[name]
- Refactor         : refactor/[name]
```

---

## 6. Code Conventions

```
# General
- Apply SOLID, DRY, and Clean Code principles
- Avoid code duplication - extract to a function if used more than once
- Write readable code over clever one-liners

# TypeScript
- strict mode enabled in tsconfig.json
- Never use 'any' - use 'unknown' and narrow the type
- Always declare explicit return types on exported functions
- Use interface for object shapes, type for unions/intersections/utility types
- Use Zod schemas as the single source of truth for validation + type inference

# Import Order
1. Node built-ins (fs, path, crypto)
2. External packages (express, zod, drizzle-orm)
3. Internal absolute (@/modules, @/utils, @/types)
4. Internal relative (./service, ../middleware)
5. Type imports (import type { ... })

# Export Pattern
- Always use named exports
- No default exports except in entry files (app.ts, server.ts)

# Error Handling
- All async route handlers must be wrapped in try-catch or asyncWrapper utility
- Never let a Promise reject silently
- Use specific HTTP status codes - never just 500 for everything
- Never expose stack traces or raw DB errors to clients in production
```

---

## 7. API Endpoint Specification

All endpoints are prefixed with `/api/v1`.

### 7.1 Authentication (`/auth`)

| Method | Endpoint           | Auth | Description                                    |
|--------|--------------------|------|------------------------------------------------|
| POST   | /auth/register     | No   | Register new user (guest role by default)      |
| POST   | /auth/login        | No   | Login, returns access + refresh tokens         |
| POST   | /auth/refresh      | No   | Exchange refresh token for new access token    |
| POST   | /auth/logout       | Yes  | Invalidate session (delete from user_sessions) |
| GET    | /auth/me           | Yes  | Get current authenticated user + profile       |

Tables: `users`, `user_profiles`, `user_sessions`

### 7.2 Villas (`/villas`)

| Method | Endpoint                          | Auth  | Description                               |
|--------|-----------------------------------|-------|-------------------------------------------|
| GET    | /villas                           | No    | List villas with filters & pagination     |
| GET    | /villas/:slug                     | No    | Get single villa detail by slug           |
| GET    | /villas/:villaId/availability     | No    | Get availability calendar for date range  |
| GET    | /villas/:villaId/reviews          | No    | Paginated reviews for a villa             |
| POST   | /villas                           | host  | Create a new villa listing                |
| PUT    | /villas/:villaId                  | host  | Update villa info                         |
| DELETE | /villas/:villaId                  | host  | Soft-delete a villa                       |
| POST   | /villas/:villaId/images           | host  | Add image URL to villa                    |
| DELETE | /villas/:villaId/images/:imageId  | host  | Remove a villa image                      |
| PUT    | /villas/:villaId/availability     | host  | Block / unblock dates manually            |

Query params for GET /villas:
- area_id, property_type_id, amenity_ids (comma-separated)
- min_price, max_price, guests, bedrooms
- check_in, check_out (YYYY-MM-DD) - filter out unavailable villas
- sort: price_asc | price_desc | rating_desc | newest
- page, limit (max 50)

Tables: `villas`, `villa_images`, `villa_amenities`, `amenities`, `villa_policies`, `villa_availability`, `areas`, `property_types`

### 7.3 Master Data

| Method | Endpoint          | Auth | Description               |
|--------|-------------------|------|---------------------------|
| GET    | /areas            | No   | List all areas            |
| GET    | /property-types   | No   | List all property types   |
| GET    | /amenities        | No   | List all amenities        |

Tables: `areas`, `property_types`, `amenities`

### 7.4 Bookings (`/bookings`)

| Method | Endpoint                     | Auth   | Description                                 |
|--------|------------------------------|--------|---------------------------------------------|
| POST   | /bookings                    | guest  | Create new booking (status: pending)        |
| GET    | /bookings                    | guest  | List user's own bookings                    |
| GET    | /bookings/:bookingCode       | guest  | Get booking detail by booking_code          |
| PATCH  | /bookings/:id/cancel         | guest  | Cancel a booking (status: cancelled)        |
| GET    | /host/bookings               | host   | List all bookings for host's villas         |
| PATCH  | /host/bookings/:id/confirm   | host   | Host confirms booking (status: confirmed)   |
| GET    | /admin/bookings              | admin  | List all bookings                           |

Business Logic:
- On create: validate date availability, calculate subtotal + 10% service_fee + 11% tax, generate booking_code (BK-YYYY-XXXX)
- On confirmed/paid: insert date range into villa_availability with status 'booked'
- On cancel: revert villa_availability records back to 'available'

Tables: `bookings`, `villa_availability`, `villas`

### 7.5 Payments (`/payments`)

| Method | Endpoint               | Auth       | Description                                            |
|--------|------------------------|------------|--------------------------------------------------------|
| POST   | /payments/initiate     | guest      | Create Xendit payment request for a booking            |
| POST   | /payments/webhook      | Xendit     | Receive Xendit callback (verify x-callback-token)      |
| GET    | /payments/:paymentCode | guest      | Get payment status & detail                            |

Payment Gateway: **Xendit** (xendit-node SDK)

Payment methods mapped to Xendit products:
- `transfer`  -> Xendit Virtual Account (BCA, BNI, BRI, Mandiri, Permata) -> inserts into `payment_transfer_details`
- `ewallet`   -> Xendit E-Wallet (GoPay, OVO, DANA, ShopeePay) -> inserts into `payment_ewallet_details` (checkout URL / QR)
- `card`      -> Xendit Credit Card charge -> inserts into `payment_card_details`

Xendit Webhook flow:
1. Validate `x-callback-token` header against `XENDIT_WEBHOOK_TOKEN`
2. Parse Xendit event payload (payment_id, status, external_id)
3. Update `payments.status` + store raw payload in `gateway_response` (jsonb)
4. If status is `PAID` / `SETTLED`: update `bookings.status` to `paid`, lock `villa_availability` dates
5. If status is `EXPIRED` / `FAILED`: update `payments.status` to `failed`

Tables: `payments`, `payment_transfer_details`, `payment_card_details`, `payment_ewallet_details`, `bookings`, `villa_availability`

### 7.6 Reviews (`/reviews`)

| Method | Endpoint              | Auth  | Description                                    |
|--------|-----------------------|-------|------------------------------------------------|
| POST   | /reviews              | guest | Submit a review (only for completed bookings)  |
| PATCH  | /reviews/:id/reply    | host  | Host replies to a review                       |
| DELETE | /reviews/:id          | guest | Soft-delete own review                         |

Tables: `reviews`, `bookings`

### 7.7 Wishlists (`/wishlists`)

| Method | Endpoint             | Auth  | Description                    |
|--------|----------------------|-------|--------------------------------|
| GET    | /wishlists           | guest | Get user's wishlist            |
| POST   | /wishlists/:villaId  | guest | Add villa to wishlist (upsert) |
| DELETE | /wishlists/:villaId  | guest | Remove villa from wishlist     |

Tables: `wishlists`, `villas`

### 7.8 User Profile (`/users`)

| Method | Endpoint         | Auth | Description         |
|--------|------------------|------|---------------------|
| GET    | /users/profile   | Yes  | Get own profile     |
| PUT    | /users/profile   | Yes  | Update own profile  |
| PATCH  | /users/password  | Yes  | Change password     |

Tables: `users`, `user_profiles`

---

## 8. Standard API Response Format

All endpoints MUST return this envelope:

```typescript
// Success
{
  "success": true,
  "data": T | T[] | null,
  "message": string,
  "meta": {             // Only for paginated list endpoints
    "page": number,
    "limit": number,
    "total": number,
    "totalPages": number
  }
}

// Error
{
  "success": false,
  "data": null,
  "message": string,
  "errors": ZodIssue[] | null   // Present only for validation errors
}
```

HTTP Status Codes:
- 200 OK (GET, PUT, PATCH success)
- 201 Created (POST success)
- 204 No Content (DELETE success)
- 400 Bad Request / Validation Error
- 401 Unauthorized (missing or invalid token)
- 403 Forbidden (valid token, insufficient role)
- 404 Not Found
- 409 Conflict (duplicate email, date already booked)
- 422 Unprocessable Entity (business logic failure)
- 429 Too Many Requests (rate limited)
- 500 Internal Server Error

---

## 9. Authentication & Authorization

```
# JWT Strategy
- Access Token  : expires 15m, signed with JWT_ACCESS_SECRET
- Refresh Token : expires 7d, signed with JWT_REFRESH_SECRET, stored in user_sessions
- On refresh    : validate token signature + check session in DB + check expires_at

# Role-Based Access Control (RBAC)
- guest  : own bookings, wishlists, reviews, profile
- host   : guest permissions + own villa management + own villa bookings
- admin  : full access to all resources

# Middleware Chain
- authMiddleware     : decode JWT, attach req.user = { id, email, role }
- roleGuard(roles[]) : verify req.user.role is in allowed roles array

# Session Management
- On logout          : delete session from user_sessions
- On password change : delete ALL sessions for the user (force re-login)
```

---

## 10. Database & Drizzle ORM

```
# Schema Files (src/db/schema/)
- auth.schema.ts         : users, user_profiles, user_sessions
- properties.schema.ts   : areas, property_types, villas, villa_images,
                           amenities, villa_amenities, villa_policies
- availability.schema.ts : villa_availability
- bookings.schema.ts     : bookings
- payments.schema.ts     : payments, payment_transfer_details,
                           payment_card_details, payment_ewallet_details
- social.schema.ts       : reviews, wishlists

# Soft Delete Policy
- Tables with deleted_at: users, villas, bookings, reviews
- Always add .where(isNull(table.deletedAt)) in all non-admin queries
- Never run hard DELETE on these tables

# Timestamps Convention
- created_at, updated_at, deleted_at present on all transactional tables
- updated_at auto-updated via Drizzle $onUpdate(() => new Date())

# Query Rules
- Always use Drizzle parameterized queries - no raw SQL string concatenation
- Use db.transaction() for multi-table writes:
  * booking creation + availability conflict check
  * payment completion + booking status update + availability lock
```

---

## 11. Middleware Stack

```
# Global Middleware (registered in app.ts, in this order)
1. helmet()                      - Security headers
2. cors({ origin: FRONTEND_URL }) - Allow frontend origin only
3. express.json()                - Parse JSON bodies
4. morgan('dev')                 - HTTP request logging (dev only)

# Per-Route Middleware
- validate(schema)   - Zod body/query/param validation
- authMiddleware     - Verify JWT access token, attach req.user
- roleGuard([role])  - Role-based access control

# Rate Limiting
- POST /auth/login    : 10 requests per 15 min per IP
- POST /auth/register : 5 requests per hour per IP

# Error Handler (last middleware in app.ts)
- errorMiddleware - Catches all thrown errors, formats into ApiResponse
```

---

## 12. Git Rules

Commit after each meaningful change before moving to the next task.

```
# Commit Message Format
feat     : add user authentication with JWT
fix      : resolve booking conflict on overlapping dates
refactor : extract price calculation into separate utility
style    : format code with prettier
docs     : update API endpoint table in gemini.md
test     : add integration tests for booking creation
chore    : configure drizzle-kit for supabase connection

# Rules
- Never commit .env or any file containing secrets
- One commit per specific, coherent change
- Do not mix unrelated changes in a single commit
```

---

## 13. Features

```
# Completed
(none yet - project is starting from scratch)

# In Progress
- [ ] Project scaffold (Express + TypeScript + Drizzle setup)
- [ ] Drizzle schema definition mirroring Schema.dbml

# Planned
- [ ] Auth module (register, login, refresh, logout, /me)
- [ ] Villas module (CRUD + search/filter + availability)
- [ ] Areas, Property Types, Amenities (read-only master data)
- [ ] Availability engine (check + block + auto-lock on booking confirmed)
- [ ] Bookings module (create, list, cancel, host confirm)
- [ ] Payments module (initiate, webhook handler, status check)
- [ ] Reviews module (submit, host reply, soft-delete)
- [ ] Wishlists module (add, remove, list)
- [ ] User profile module (view, update, change password)
- [ ] Swagger / OpenAPI documentation
- [ ] Rate limiting on auth endpoints
- [ ] Unit + integration tests (80% coverage target)
- [ ] Deployment configuration (Railway)
```

---

## 14. Testing

```
# Approach
- Framework     : Vitest (unit) + Supertest (integration/e2e)
- Test database : Separate Supabase project or local PostgreSQL via Docker

# What to Test
- All service layer functions (unit tests, mock DB)
- All API endpoints - happy path + validation errors + auth errors
- Business logic: price calculation, availability conflict, booking code generation

# What NOT to Test
- Drizzle ORM internals (already tested by its maintainers)
- Pure config files

# Test File Convention
- src/modules/auth/auth.service.test.ts  (unit)
- tests/integration/villas.test.ts       (integration)

# Coverage Target
- Minimum  : 80%
- Priority : Services > Controllers > Utils
```

---

## 15. Do Not

```
# Structure & Files
- Do not create new top-level folders without confirmation
- Do not delete or rename existing files without confirmation
- Do not modify Drizzle schema without also generating a new migration

# Code
- Do not use 'any' in TypeScript - use 'unknown' + type narrowing
- Do not hardcode credentials, secrets, or API URLs in source code
- Do not commit .env or any file containing secrets
- Do not install new packages without confirming with the developer
- Do not skip Zod validation on any mutation endpoint (POST, PUT, PATCH, DELETE)

# Security
- Do not expose SUPABASE_SERVICE_ROLE_KEY in any response or log
- Do not skip HMAC verification on the payment webhook endpoint
- Do not bypass role guards for admin-only routes
- Do not return raw database error messages in production

# Database
- Do not run hard DELETE on tables with deleted_at column (soft delete only)
- Do not write migrations manually - always use npm run db:generate
- Do not use raw string interpolation in SQL queries

# Patterns
- Do not put business logic inside controllers
- Do not put DB queries inside controllers or routers
- Do not use callbacks - always use async/await
```

---

## 16. Environment Variables

```bash
# Copy .env.example to .env for local development
# Never commit .env to the repository

# Server
PORT=3001
NODE_ENV=development

# Supabase
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...          # Server-only - NEVER expose to client
DATABASE_URL=postgresql://...@db.xxxx.supabase.co:5432/postgres

# JWT
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:5173

# Payment Gateway - Xendit
XENDIT_SECRET_KEY=xnd_production_...        # Server-only - NEVER expose to client
XENDIT_WEBHOOK_TOKEN=...                    # Validate x-callback-token on webhook
XENDIT_SUCCESS_REDIRECT_URL=http://localhost:5173/booking/success
XENDIT_FAILURE_REDIRECT_URL=http://localhost:5173/booking/failed
```

---

## 17. Recommended Libraries

| Purpose                | Package                                          |
|------------------------|--------------------------------------------------|
| Web framework          | express v5                                       |
| TypeScript dev runner  | tsx (dev), tsc (build to dist/)                  |
| ORM                    | drizzle-orm + drizzle-kit                        |
| DB driver (PostgreSQL) | postgres (pg driver for Drizzle)                 |
| Supabase SDK           | @supabase/supabase-js                            |
| Validation             | zod                                              |
| JWT                    | jsonwebtoken + @types/jsonwebtoken               |
| Password hashing       | bcryptjs + @types/bcryptjs                       |
| Security headers       | helmet                                           |
| CORS                   | cors + @types/cors                               |
| HTTP logger            | morgan + @types/morgan                           |
| Rate limiting          | express-rate-limit                               |
| API docs               | swagger-ui-express + @asteasolutions/zod-to-openapi |
| Date utilities         | date-fns                                         |
| Payment gateway        | xendit-node                                      |
| Testing                | vitest + supertest + @types/supertest            |
| UUID                   | native crypto.randomUUID() - no extra package    |

---

_This document is the living specification for the Balivio Backend API.
Update it as the project evolves. When in doubt, refer to this document first before writing code._
