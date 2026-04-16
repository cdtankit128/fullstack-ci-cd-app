# TaskSphere

**TaskSphere** is an ultra-modern, high-performance, and beautifully designed full-stack task management dashboard. Tailored for students and professionals, it provides an exquisite UI (re-imagined with a dark glassmorphic scheme and vivid purple accents) alongside robust productivity tracking mechanisms like consistency streaks and personalized academic profiles. 

## Key Features
- **University Dataset Integration:** A seamless, password-less login experience utilizing institutional UIDs. The system instantly verifies details, mapping UIDs to real student names via our secure Cloud Database.
- **Exquisite Dashboard:** A beautifully restructured dashboard tracking active tasks, overall task completion percentages, and longest day-to-day streaks.
- **Advanced Task Management:** A 'Focus List' featuring dynamic tag-filtering (All/Active/Completed), priority mappings, and an integrated DatePicker.
- **Deep Analytics:** A dedicated Insights page featuring animated, fluid CSS bar charts highlighting rolling 7-day completion consistency and tracking overall efficiency metrics.
- **Real-time Serverless Backend:** Employs ultra-fast Vercel serverless functions in the `/api` directory for rapid CRUD operations to our Cloud Database.
- **Zero-Friction CI/CD Deployment:** Every push successfully triggers automated GitHub Actions and Vercel pipeline updates for instantaneous zero-downtime deployments.

## Technology Stack
- **Frontend Framework:** React 18, Vite, React Router
- **Styling:** Tailwind CSS, Material-UI (MUI), custom glassmorphic utility ecosystems.
- **Backend Architecture:** Vercel Serverless Functions (`api/todos.js`, `api/students.js`)
- **Database:** Supabase (PostgreSQL) integrated via `@supabase/supabase-js` using the REST API for high-availability headless operations.

## How It Works
Users authenticate smoothly by merely entering their assigned UID (e.g. `23BCS...`). Upon valid entry, the server authenticates against the Supabase `students` table and provisions a session. From the dashboard, users manage their tasks while the front-end natively proxies `fetch` requests towards the serverless `/api/todos` endpoint—resolving listings, creations, updates, and cascading delete operations cleanly into the persistent Supabase database.

## Local Setup & Environment Variables
To run this project locally, you need to connect it to your Supabase project. Add a `.env` file to the root of the project with the following variables:
```env
SUPABASE_URL=https://<your-project-id>.supabase.co
SUPABASE_KEY=<your-anon-or-service-role-key>
```
*Note: Make sure your `.env` file is added to `.gitignore` so you do not expose your credentials.*

## Database Schema
Ensure the following tables are created in your Supabase SQL editor:
```sql
create table students (
  uid text primary key,
  name text not null
);

create table todos (
  id text primary key,
  uid text not null,
  text text not null,
  completed boolean default false,
  priority text default 'Medium',
  due_date timestamptz,
  created_at timestamptz default now(),
  completed_at timestamptz
);
```

## Deployment Model
The project adopts a modern GitOps pipeline optimized specifically for **Vercel**. Pushing to the `main` branch on GitHub automatically kicks off the deployment cycle. Provide `SUPABASE_URL` and `SUPABASE_KEY` directly inside Vercel's Environment Variables settings before deployment.

## Main Directory Structure
- `frontend/` — The React/Vite dashboard, containing all components, contexts, UI pages, and Tailwind configurations.
- `api/` — The lightweight Vercel serverless backend interface endpoints connecting to Supabase.
- `.github/workflows/` — Continuous Integration check configurations.
