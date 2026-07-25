# Balivio Backend API 🏝️

RESTful API server for **Balivio**, a modern Bali villa search, booking, and host management platform.

---

## 🚀 Tech Stack & Architecture

- **Runtime & Framework**: Node.js v20+, Express.js v5 (Promises & Async handler native support)
- **Language**: TypeScript (Strict Mode)
- **Database**: PostgreSQL (Hosted on Supabase)
- **ORM & Migrations**: Drizzle ORM + Drizzle Kit
- **Authentication**: Supabase Auth + Native JWT (Access & Refresh Tokens)
- **Validation**: Zod (Type-safe schema validation)
- **Payment Gateway**: Xendit Invoice API v6 Integration
- **Testing**: Built-in Automated E2E & Integration Test Suites

---

## 📁 Directory Structure

```text
backend/
├── src/
│   ├── config/          # Env variables, Supabase admin client, database connection
│   ├── db/              # Drizzle schemas, migrations, seed script & DDL applier
│   ├── middleware/      # Auth (JWT & Role Guards), Zod validation, Error & Rate limiters
│   ├── modules/
│   │   ├── controller/  # Express request/response handlers
│   │   ├── router/      # Express route definitions
│   │   ├── schema/      # Zod validation schemas
│   │   └── service/     # Business logic & DB queries
│   ├── types/           # Custom Express & API TypeScript declarations
│   ├── utils/           # Response formatters, JWT helpers, pagination helpers
│   ├── app.ts           # Express app setup & global middleware
│   └── server.ts        # Entry point server runner
├── testing/             # E2E Automated Integration Test Scripts
│   ├── api-test.ts      # Fast API availability test
│   └── full-system-test.ts # 18-Table Database & full E2E business lifecycle test
├── SCHEMA_DB.sql        # Database DDL schema (18 Tables, triggers, indexes)
├── drizzle.config.ts    # Drizzle Kit configuration
└── tsconfig.json        # TypeScript configuration
```

---

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js v20.x or higher
- npm v10.x or higher
- Supabase Project & PostgreSQL connection

### 2. Environment Configuration
Copy `.env.example` to `.env` and fill in your credentials:
```bash
cp .env.example .env
```

Key environment variables:
```env
PORT=3001
NODE_ENV=development
SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
DATABASE_URL=postgresql://postgres.<project-ref>:<password>@aws-1-<region>.pooler.supabase.com:6543/postgres
JWT_ACCESS_SECRET=<your-32-byte-secret>
JWT_REFRESH_SECRET=<your-32-byte-secret>
XENDIT_SECRET_KEY=xnd_development_...
XENDIT_WEBHOOK_TOKEN=...
FRONTEND_URL=http://localhost:8080
```

### 3. Database Setup & Seeding
Populate master data (Areas, Property Types, Amenities):
```bash
npm run db:seed
```

### 4. Running Dev Server
```bash
npm run dev
```
Server runs at `http://localhost:3001` (Health check: `http://localhost:3001/health`).

---

## 📖 API Endpoints Reference

All endpoints are prefixed with `/api/v1` except `/health`.

### 🩺 Health Check
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | Public | Server health status check |

---

### 🗝️ Authentication (`/api/v1/auth`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register new Guest / Host user |
| `POST` | `/auth/login` | Public | Login with email & password (returns tokens) |
| `GET` | `/auth/google` | Public | Get Google OAuth redirect URL |
| `POST` | `/auth/refresh` | Public | Refresh expired access token |
| `GET` | `/auth/me` | Bearer Token | Fetch current authenticated user info |

---

### 👤 User Management (`/api/v1/users`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/users/profile` | Bearer Token | Get user profile details |
| `PUT` | `/users/profile` | Bearer Token | Update user profile (address, phone, birth date, avatar) |
| `POST` | `/users/change-password` | Bearer Token | Change account password |

---

### 📍 Master Data (`/api/v1/areas`, `/property-types`, `/amenities`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/areas` | Public | List all Bali regions/areas (Ubud, Seminyak, Canggu, etc.) |
| `GET` | `/property-types` | Public | List property categories (Private Villa, Resort, Beachfront, etc.) |
| `GET` | `/amenities` | Public | List available amenities (Pool, WiFi, AC, Chef, etc.) |

---

### 🏡 Villas Management (`/api/v1/villas`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/villas` | Public | Search & filter villas with pagination (`area_id`, `check_in`, `check_out`, `min_price`, `max_price`, `guests`, `amenity_ids`, `sort`) |
| `GET` | `/villas/:slug` | Public | Get detailed villa info by URL slug |
| `POST` | `/villas` | Host / Admin | Create a new villa listing |
| `PUT` | `/villas/:id` | Host / Admin | Update villa details |
| `DELETE` | `/villas/:id` | Host / Admin | Soft delete a villa |
| `POST` | `/villas/:id/images` | Host / Admin | Add image to villa gallery |
| `DELETE` | `/villas/:id/images/:imageId` | Host / Admin | Delete image from gallery |
| `GET` | `/villas/:id/availability` | Public | Get availability calendar status for a date range |
| `PUT` | `/villas/:id/availability` | Host / Admin | Block / unblock dates for maintenance or manual bookings |

---

### ❤️ Wishlists (`/api/v1/wishlists`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/wishlists` | Guest | List user's saved wishlist villas |
| `POST` | `/wishlists/:villaId` | Guest | Add villa to wishlist |
| `DELETE` | `/wishlists/:villaId` | Guest | Remove villa from wishlist |

---

### 📅 Booking Lifecycle (`/api/v1/bookings`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/bookings` | Guest | Create new villa booking (auto calculates subtotal + 10% service fee + 11% tax) |
| `GET` | `/bookings` | Guest | List user's own bookings |
| `GET` | `/bookings/:bookingCode` | Guest / Host | Get booking details by code (e.g. `BK-2026-XXXX`) |
| `PATCH` | `/bookings/:id/cancel` | Guest / Host | Cancel pending booking |
| `GET` | `/bookings/host/bookings` | Host | List all bookings for Host's villas |
| `PATCH` | `/bookings/host/bookings/:id/confirm` | Host | Confirm pending booking (locks dates on availability calendar) |
| `GET` | `/bookings/admin/bookings` | Admin | List all system bookings |

---

### 💳 Payments & Gateway Integration (`/api/v1/payments`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/payments/initiate` | Guest | Initiate Xendit Hosted Invoice (Bank Transfer, Credit Card, eWallet) |
| `POST` | `/payments/webhook` | Xendit Token | Xendit webhook listener for `invoice.paid` & `invoice.expired` events |

---

### ⭐ Reviews & Ratings (`/api/v1/reviews`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/reviews` | Guest | Submit 1-5 star review for completed stay |
| `GET` | `/reviews/villa/:villaId` | Public | List reviews for a specific villa |
| `PATCH` | `/reviews/:id/reply` | Host | Host reply to guest review |

---

## 🧪 Automated Testing

Run the automated test suites to verify backend health and business flows:

```bash
# Type check TypeScript code
npm run type-check

# Fast API availability test
npm run test:api

# Full 18-table database coverage & E2E integration test
npm run test:full
```

---

## 📄 License

[MIT](LICENSE)
