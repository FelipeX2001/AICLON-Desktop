# AICLON Desktop

## Overview
AICLON Desktop is a comprehensive business management dashboard application built with React, TypeScript, and Vite. The application features a dark/neon theme design system with support for both light and dark modes.

## Purpose
A CRM-style desktop application for managing:
- Team members and user accounts
- Leads and sales pipeline
- Active clients and their service status
- Tasks and meetings
- Bot versions and tutorials

## Current State
- Fully functional React application running on port 5000
- Login system with admin account (admin@aiclon.io / admin1234)
- Data persistence using localStorage
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
├── public/
│   └── fonts/
│       └── Designer.otf
├── App.tsx              # Main application component
├── index.tsx            # Entry point
├── types.ts             # TypeScript type definitions
├── index.html           # HTML template with Tailwind config
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies
```

## Key Technologies
- React 19
- TypeScript
- Vite 6
- Tailwind CSS (via CDN)
- Lucide React (icons)

## Environment Variables
- `GEMINI_API_KEY`: API key for Gemini AI features (stored as secret)

## Development
```bash
npm install
npm run dev
```

## Deployment
Static site deployment configured with:
- Build: `npm run build`
- Output: `dist` directory

## Recent Changes (Nov 2024)
- Configured for Replit environment (port 5000, allowed hosts)
- Fixed TypeScript error in ActiveClientsBoard.tsx (User icon naming conflict)
- Set up deployment configuration for static hosting
