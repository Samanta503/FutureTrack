# FutureTrack

FutureTrack is a modern, responsive career development platform for students and job-seekers.

## Tech Stack

- Frontend: Next.js (App Router) + TypeScript + Tailwind CSS
- Backend/API: Next.js Route Handlers
- Database: MySQL

## Implemented Pages

- Landing page (`/`)
- Jobs page (`/jobs`)
- Courses page (`/courses`)

## Core UX Features Reflected

- Interactive Profile Builder preview with CV generation CTA
- Job Matching with match percentage and skill-gap display
- Skill-gap based course suggestions
- Dashboard recommendation cards and market pro tips

## Project Structure

```text
src/
	app/
		page.tsx
		jobs/page.tsx
		courses/page.tsx
	components/
		common/
		jobs/
		courses/
	data/
		mock-data.ts
	lib/
		types.ts
		career-utils.ts
mysql/
	schema.sql
```

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## MySQL Setup

1. Copy `.env.local.example` to `.env.local` and fill your DB credentials.
2. Create schema and tables:

```sql
source mysql/schema.sql;
```

3. Seed sample data:

```sql
source mysql/seed.sql;
```

4. Start app:

```bash
npm run dev
```

## API Routes

- `GET /api/health`
- `GET /api/users`
- `POST /api/users`
- `GET /api/users/:id`
- `GET /api/jobs?query=&domain=&level=&location=`
- `POST /api/jobs`
- `GET /api/jobs/:id`
- `GET /api/courses?query=&category=&level=&domain=`
- `POST /api/courses`
- `GET /api/recommendations?userId=&type=`
- `POST /api/recommendations`

## MySQL Schema

The relational schema is provided in:

- `mysql/schema.sql`
- `mysql/seed.sql` (sample data)

It includes tables for:

- `users`
- `profiles`
- `skills`
- `jobs`
- `job_skills`
- `courses`
- `course_skills`
- `recommendations`
- `user_course_enrollments`

## Notes

- UI now calls MySQL-backed API routes, with graceful fallback to dummy data when DB is unavailable.
- The UI is designed to be startup-like, youth-friendly, and responsive for desktop, tablet, and mobile.
