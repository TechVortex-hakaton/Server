# Server — Health & Medical Platform Backend

Core backend REST API serving the Doctor and Admin frontends for a health, sport, and medical platform.

## Stack

Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, JWT, bcryptjs, Zod, Helmet, CORS, Morgan.

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Configure `.env` (already created with local defaults):
   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/healthy_life"
   JWT_SECRET="change-this-secret"
   PORT=5000
   CLIENT_URL="http://localhost:5173,http://localhost:5174"
   ```
3. Create the database (if it doesn't exist) and run migrations:
   ```
   npx prisma migrate dev --name init
   ```
4. Seed demo data:
   ```
   npm run seed
   ```
5. Start the dev server:
   ```
   npm run dev
   ```

Server runs at `http://localhost:5000`, API mounted at `http://localhost:5000/api`.

## Demo credentials

- Admin: `admin@healthy.uz` / `Admin123!`
- Doctor: `doctor@healthy.uz` / `Doctor123!`
- Patient: `patient@healthy.uz` / `Patient123!`

## Roles

- `ADMIN` — manages doctors, users, patients, appointments, articles, categories, sports; views dashboard stats.
- `DOCTOR` — manages own profile, appointments, patients, and medical records.
- `PATIENT` — registers via `/api/auth/register`, books/manages own appointments.

## Scripts

- `npm run dev` — start dev server with hot reload
- `npm run build` — compile TypeScript to `dist/`
- `npm start` — run compiled production build
- `npm run prisma:migrate` — run Prisma migrations
- `npm run prisma:studio` — open Prisma Studio
- `npm run seed` — seed the database
