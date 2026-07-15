# Balivio

Balivio is a production-ready vacation villa discovery and booking platform in Bali, similar to Traveloka. It features a complete monorepo-style setup containing a React client and an Express TypeScript backend API.

---

## 🏗️ Project Architecture

The codebase is organized into two main parts:

### 1. Frontend (`/` - Root directory)
- **Framework**: React + Vite
- **Routing & SSR**: TanStack Start + TanStack Router (TypeScript)
- **Styling**: Tailwind CSS
- **Components**: Radix UI + shadcn/ui primitives + Lucide React icons
- **State & Data Fetching**: TanStack React Query

### 2. Backend (`/api` directory)
- **Framework**: Express.js v5 (TypeScript)
- **Database**: PostgreSQL hosted on Supabase
- **ORM**: Drizzle ORM (type-safe schemas and migrations)
- **API Validation**: Zod Schema validation
- **Payment Gateway**: Xendit (Virtual Accounts, E-Wallets, Cards)
- **Security**: custom JWT sessions, helmet, express-rate-limit, custom zero-dependency colored logging

---

## 📁 Repository Structure

```
bali-villa-finder/
  ├── api/                 # Backend API service (Express.js + Drizzle)
  │   ├── src/
  │   │   ├── config/      # Environment validation & SDK initiators
  │   │   ├── db/          # Drizzle client, seeds, and SQL schemas
  │   │   ├── middleware/  # Auth guards, validators, rate limiters
  │   │   ├── modules/     # Domain controller, service, router layers
  │   │   └── utils/       # JWT signers, response builders, colors
  │   └── tsconfig.json
  ├── docs/                # Database blueprints & specifications
  │   ├── Schema.dbml      # Database structure in DBML markup
  │   └── docsSchema.md    # Mapping flows (auth, search, booking, payment)
  ├── src/                 # Frontend client app components & router tree
  │   ├── components/      # UI components (booking, villas, search, layout)
  │   ├── routes/          # TanStack Router page layouts and paths
  │   └── styles.css       # Tailwind configuration and tokens
  ├── package.json         # Frontend package manager
  └── README.md            # This documentation file
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20 or higher)
- npm package manager

### Backend Setup
1. Navigate into the API directory:
   ```bash
   cd api
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment:
   ```bash
   cp .env.example .env
   ```
   *(Fill in your Supabase connection strings, JWT secret keys, and Xendit credentials inside `.env`)*
4. Run migrations and seed data:
   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```
5. Start development server:
   ```bash
   npm run dev
   ```
   The backend API will run on `http://localhost:3001` with beautifully colored logging.

### Frontend Setup
1. Go back to the root directory:
   ```bash
   cd ..
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development client:
   ```bash
   npm run dev
   ```
   The client application will run on `http://localhost:5173`.

---

## 📃 Related Specifications

- For API rules, endpoint definitions, and naming guidelines, check the assistant guideline file: [api/gemini.md](file:///c:/Users/dendr/OneDrive/Documents/bali-villa-finder/api/gemini.md)
- For database details and UI integration flows, check: [docs/docsSchema.md](file:///c:/Users/dendr/OneDrive/Documents/bali-villa-finder/docs/docsSchema.md)
