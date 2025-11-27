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

## Official Brand Color Palette
```
#F7FBFF - Light/White (backgrounds, light text)
#00C8FF - Cyan Primary (main accent, completed states, highlights)
#005AB7 - Blue Primary (secondary accent, gradients end)
#F06000 - Orange (details, warnings, special accents)
#040308 - Black/Dark (backgrounds, dark mode base)
```

**Usage Guidelines:**
- Primary colors: Cyan (#00C8FF) and Blue (#005AB7)
- Gradients: Use from cyan to blue (from-[#00C8FF] to-[#005AB7])
- Orange (#F06000): For details and special accents only
- Completed/success states: Use cyan (#00C8FF), NOT green
- Dark backgrounds: Use #040308 or similar dark tones

## Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (auto-configured by Replit)
- `GEMINI_API_KEY`: API key for Gemini AI features (stored as secret)

## Architecture
- **Two-server setup**: Frontend (Vite dev server on port 5000) + Backend (Express API on port 3001)
- **Proxy configuration**: Vite proxies `/api/*` requests to backend
- **Authentication**: Database-backed with secure bcrypt password hashing
- **Data persistence**: All entities persist through PostgreSQL API (no localStorage except theme preference)

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

## Recent Changes (Nov 27, 2025)
- **Multi-selection for Servicio de Interés**: Field changed from single-select to multi-select
  - Database migration: Changed servicioInteres from varchar to jsonb array
  - LeadModal: Changed from dropdown to checkboxes for selecting multiple services
  - Legacy data compatibility: Old string values automatically converted to arrays ["value"]
  - All components updated: LeadViewModal, ActiveClientViewModal, ActiveClientsBoard, ActiveClientModal
  - Backend validation: normalizeServicioInteres function ensures array consistency
  - Services available: "Agente IA", "Pagina Web" (can select both)
- **Multiple Assignees for Tasks**: Tasks now support multiple assignees
  - Schema: assigneeId changed to assigneeIds (jsonb array)
  - UI: Multi-select checkbox interface with overlapping avatar display (max 3 + counter)
  - TaskBoard and TaskModal updated to handle multiple users
- **Role-Based Permissions System**: Comprehensive access control for admin vs developer roles
  - Admin (role='admin'): Full access to all features - create, edit, delete everything
  - Developer (role='developer'): Limited access - can only create/edit/delete Tasks & Meetings
  - Restricted components for developers (view-only):
    - LeadBoard: No create/edit buttons, no drag-drop
    - LeadViewModal: No edit button
    - ActiveClientsBoard: No drag-drop between stages, no payment toggle
    - ActiveClientViewModal: No edit button
    - BotVersionsView: No create/edit cover buttons
    - BotVersionViewModal: No edit button
    - TutorialsView/TutorialPage: No create/edit buttons
    - DashboardHome: No demo create/edit buttons
    - DroppedClientsView: No recover/delete buttons
    - ClientsDashboard: All view modals respect permissions
  - Implementation: `const isAdmin = currentUser?.role === 'admin'` check in each component
  - Pattern: ViewModals receive `currentUser` prop to conditionally render edit buttons
- **Full-page Tutorial System**: Tutoriales ahora son páginas completas en lugar de modales
  - TutorialPage.tsx: Página de visualización con banner, título, descripción, links, pasos y media
  - TutorialEditPage.tsx: Página de edición completa solo para admins
  - TutorialsView.tsx: Click en tutorial navega a página completa
  - Nuevo campo `steps` en schema para contenido paso a paso
  - Flujo: Lista → Ver tutorial → Editar (solo admins) → Ver actualizado
- **Meeting Schema Fix**: Corregido campo clientId de serial a integer nullable para permitir reuniones sin cliente
- **View Modal Pattern**: All entity boards now follow consistent view → edit modal pattern
  - LeadViewModal.tsx: Read-only lead details with edit button
  - ActiveClientViewModal.tsx: Read-only client details with edit button
  - MeetingViewModal.tsx: Read-only meeting details with edit button
  - BotVersionViewModal.tsx: Read-only bot version details with edit button
  - Click card → View modal (read-only) → Edit button → Edit modal
- **ClientsDashboard Fix**: Fixed critical bug where localStorage was used instead of API data, causing phantom/stale clients
- **DroppedClientsView**: Refactored to use props from App.tsx instead of localStorage
- **Full-page User Profile View (UserProfilePage.tsx)**: Complete profile page with three functional tabs
  - Header with cover image, avatar, user info, and role badge
  - Tasks Tab: Full Kanban board filtered by user with drag-and-drop, auto-assigns user when creating new tasks
  - Meetings Tab: Calendar view filtered by user with monthly navigation, auto-assigns user when creating new meetings
  - Clients Tab: Detailed client cards with images filtered by assignedUserId
  - TeamView: Clicking a user navigates to full-page profile instead of modal
  - Profile Dropdown Menu: Added "Ver mis Tareas" and "Ver mis Reuniones" quick navigation buttons
  - App.tsx: New state management for profileViewUser and profileViewTab
- **OG Meta Tags**: Added Open Graph image and favicon for better branding
- **Optional subtasks feature**: Tasks can now have optional subtask lists with progress tracking
  - Added `subtasks` jsonb field to tasks table in schema
  - Created `Subtask` interface with id, title, completed fields
  - TaskViewModal: New read-only modal to view task details with functional subtask checkboxes
  - TaskModal: Refactored to edit-only mode with subtask management (add/remove items, toggle feature)
  - Progress bar: Shows completion percentage on task cards when subtasks exist
  - Modal flow: Click task → TaskViewModal (view) → Edit button → TaskModal (edit with delete)
- **Complete localStorage elimination**: All data now persists through PostgreSQL API
- **Lifted state pattern**: App.tsx is now single source of truth for all application state
- **Component refactoring**: TaskBoard, MeetingsView, LeadBoard, ActiveClientsBoard, BotVersionsView, TutorialsView, DashboardHome all use props + callbacks
- **New API endpoints**: dropped_clients, demos tables and routes added
- **Real-time updates**: All CRUD operations go through centralized state in App.tsx
- **Bot versions naming**: Updated from "chatwoot" to "chatbot" across schema, types, and UI
- **Board UI improvements**: TaskBoard and ActiveClientsBoard now use fixed-width columns (w-80) with horizontal scroll for better mobile experience
- **Task detail modal**: DashboardHome now shows full task details when clicking on task cards
- **Profile photo fix**: UserEditModal correctly passes avatarUrl to ImageUploadField
- Only localStorage usage remaining: theme preference (aiclon_theme)

## Previous Changes (Nov 26, 2025)
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
