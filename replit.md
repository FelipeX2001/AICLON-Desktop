# AICLON Desktop

## Overview
AICLON Desktop is a comprehensive business management dashboard application built with React, TypeScript, Vite, Express, and PostgreSQL (NeonDB). The application features a dark/neon theme design system with support for both light and dark modes.

## Purpose
A CRM-style desktop application for managing:
- Team members and user accounts
- Leads and sales pipeline
- Active clients and their service status
- Tasks and meetings
- Bot versions and tutorials

## Current State
- Fully functional React application running on port 5000
- Backend Express API running on port 3001
- PostgreSQL database (NeonDB) for data persistence
- Login system with admin account (admin@aiclon.io / admin1234)
- Secure authentication with bcrypt password hashing
- Dark/Light theme support

## Project Structure
```
/
├── components/          # React components
│   ├── LoginScreen.tsx
│   ├── DashboardLayout.tsx
│   ├── DashboardHome.tsx
│   ├── TeamView.tsx
│   ├── LeadBoard.tsx
│   ├── ActiveClientsBoard.tsx
│   ├── TaskBoard.tsx
│   ├── MeetingsView.tsx
│   └── ...
├── server/              # Backend Express API
│   ├── index.ts         # Express server entry point
│   ├── db.ts            # Database connection
│   ├── schema.ts        # Drizzle ORM schema
│   └── routes/          # API routes
│       ├── auth.ts      # Authentication endpoints
│       ├── users.ts
│       ├── tasks.ts
│       ├── meetings.ts
│       ├── leads.ts
│       ├── activeClients.ts
│       ├── botVersions.ts
│       ├── tutorials.ts
│       └── notifications.ts
├── public/
│   └── fonts/
│       └── Designer.otf
├── App.tsx              # Main application component
├── index.tsx            # Entry point
├── client.ts            # API client for frontend-backend communication
├── types.ts             # TypeScript type definitions
├── index.html           # HTML template with Tailwind config
├── vite.config.ts       # Vite configuration (includes proxy to backend)
├── drizzle.config.ts    # Drizzle ORM configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies
```

## Key Technologies
- **Frontend**: React 19, TypeScript, Vite 6
- **Backend**: Express, Node.js, TypeScript
- **Database**: PostgreSQL (NeonDB), Drizzle ORM
- **Security**: bcryptjs for password hashing
- **Styling**: Tailwind CSS (via CDN)
- **Icons**: Lucide React

## Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (auto-configured by Replit)
- `GEMINI_API_KEY`: API key for Gemini AI features (stored as secret)

## Architecture
- **Two-server setup**: Frontend (Vite dev server on port 5000) + Backend (Express API on port 3001)
- **Proxy configuration**: Vite proxies `/api/*` requests to backend
- **Authentication**: Database-backed with secure bcrypt password hashing
- **Data persistence**: PostgreSQL for users (other entities still use localStorage for now)

## Development
```bash
npm install
npm run dev
```

## Deployment
Deployment configured with autoscale:
- Build: `npm run build` (compiles frontend to dist/ and backend to dist-server/)
- Run: `npm run start` (runs compiled backend JavaScript from dist-server/index.js)
- The Express server serves both:
  - API routes at `/api/*`
  - Static frontend files from `dist/` directory
- Production port: 5000 (configurable via PORT env variable)
- Backend runs compiled JavaScript (no ts-node overhead) for faster startup

## Recent Changes (Nov 26, 2025)
- Integrated NeonDB PostgreSQL database for secure data persistence
- Built Express backend API with authentication endpoints
- Migrated authentication system from localStorage to database with bcrypt
- Created Drizzle ORM schema for all application entities
- Configured Vite proxy to connect frontend and backend
- Renamed API client file from `api.ts` to `client.ts` (avoid proxy conflict)
- Set up two-workflow system: Frontend and Backend API
- Admin user seeded in database with forced password change on first login
- Configured deployment with autoscale: Express serves both API and static frontend
- Added TypeScript compilation for backend to avoid ts-node overhead in production
- Fixed deployment issues: port 5000, 0.0.0.0 binding, compiled JS execution
