## Project Summary
Sistem Absensi Siswa (SAS) is a web-based application designed to digitize and manage student attendance in educational institutions. It replaces manual processes with real-time recording, reporting, and notification features.

## Tech Stack
- Frontend: Next.js (App Router), Tailwind CSS, Framer Motion
- Backend/Database: Supabase (Auth, PostgreSQL)
- Deployment: Vercel (assumed)
- Key Dependencies: @supabase/supabase-js, lucide-react, react-hook-form, zod

## Architecture
- `src/app`: Next.js pages and layouts
- `src/lib`: Supabase client and utility functions
- `src/components`: Reusable UI components
- `src/hooks`: Custom React hooks for data fetching and auth

## User Preferences
- Role-based access control (Admin, Guru)
- Modern, clean, and responsive UI
- Real-time attendance tracking

## Project Guidelines
- Use Supabase for authentication and database
- Follow existing Tailwind CSS patterns
- Maintain clear separation of concerns between UI and business logic
- Ensure accessibility and responsiveness

## Common Patterns
- Auth: Use Supabase client for session management and role-based redirects
- Data Fetching: Use custom hooks with Supabase subscriptions for real-time updates
- Forms: Use react-hook-form with Zod validation
