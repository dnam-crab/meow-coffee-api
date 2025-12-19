# Meow Coffee API (Backend)

Backend API for **Ngoan Meow Meow Coffee**.  
Built with **Express + TypeScript + Prisma + PostgreSQL** and supports **cookie-based session auth**.

---

## Highlights

- ⚡ **Express + TypeScript** – fast, maintainable API
- 🐘 **PostgreSQL** – main database
- 🧬 **Prisma** – typed DB access (`db push` + `generate`)
- 🍪 **HTTP-only cookie session** – frontend friendly (`withCredentials`)
- 🔒 **CORS configured** for frontend origin

---

## Tech Stack

- **Runtime**: Node.js (>= 18)
- **Framework**: Express
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: Session via HTTP-only Cookie

---

## Project Structure

```bash
src/
├─ index.ts          # App entry
├─ prisma.ts         # Prisma client setup
├─ seed.ts           # Seed admin user
└─ routes/           # Route modules (auth, etc.)

prisma/
└─ schema.prisma     # DB schema
```

## Environment Variables

Create a `.env` file in project root:
```env
PORT=3001
CORS_ORIGIN=http://localhost:5173
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/meow_coffee
SESSION_COOKIE_NAME=meow_session
NODE_ENV=development
```

- PORT: API server port
- CORS_ORIGIN: frontend origin allowed (for cookie auth)
- DATABASE_URL: PostgreSQL connection string (required)
- SESSION_COOKIE_NAME: cookie name for session
- NODE_ENV: affects cookie config

## Database (PostgreSQL)
**Run PostgreSQL using Docker (PowerShell)**
```shell
docker run --name meow-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=meow_coffee -p 5432:5432 -d postgres:16
```

Check container status:
```shell
docker ps
```

## Getting Started
**Install dependencies**
```bash
npm install
# or
pnpm install
```

**Create tables (Prisma)**
```bash
npx prisma db push
```

**Generate Prisma Client (required)**
```bash
npx prisma generate
```

**Seed admin user**
```bash
npm run seed
# or
pnpm seed
```

**Seed credentials:**

- **email**: admin@meow.local
- **password**: 123456

**Run development server**
```bash
npm run dev
# or
pnpm dev
```

API will be available at:
```shell
http://localhost:3001
```