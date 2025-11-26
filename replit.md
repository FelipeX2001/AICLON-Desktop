# AICLON Desktop - Replit Project Documentation

## Overview
AICLON Desktop is a React-based web application for managing clients, leads, tasks, meetings, and team members. It features a dark/light theme toggle and uses local storage for data persistence.

## Project Information
- **Name**: AICLON Desktop
- **Type**: React + TypeScript + Vite Frontend Application
- **Framework**: React 19.2.0, Vite 6.2.0
- **Styling**: TailwindCSS (CDN), Custom CSS Variables
- **Port**: 5000 (Development & Production)

## Architecture

### Technology Stack
- **Frontend**: React 19.2.0 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: TailwindCSS (via CDN), Custom CSS Variables for theming
- **Icons**: Lucide React
- **Data Storage**: Browser LocalStorage
- **API Integration**: Gemini AI API

### Project Structure
```
/
├── components/          # React components for all views and modals
├── public/
│   └── fonts/          # Custom Designer font
├── App.tsx             # Main application component with routing logic
├── index.tsx           # Entry point
├── index.html          # HTML template
├── types.ts            # TypeScript type definitions
├── vite.config.ts      # Vite configuration
└── package.json        # Dependencies
```

### Key Components
- **Authentication**: LoginScreen, ForgotPasswordScreen, ResetPasswordScreen
- **Dashboard**: DashboardHome, DashboardLayout
- **Management**: ClientsDashboard, LeadBoard, TaskBoard, TeamView, MeetingsView
- **Modals**: Various modals for editing and viewing entities

## Environment Setup

### Required Environment Variables
- `GEMINI_API_KEY` (shared): API key for Gemini AI integration

### Development Workflow
The app runs on port 5000 with Vite's development server:
```bash
npm run dev
```

### Build & Deployment
Build command: `npm run build`
Output directory: `dist`
Deployment type: Static site

## Replit Configuration

### Workflow
- **Name**: Start application
- **Command**: `npm run dev`
- **Port**: 5000
- **Type**: Webview (frontend)

### Deployment
- **Type**: Static
- **Build**: `npm run build`
- **Public Directory**: `dist`

## Default User
- **Email**: admin@aiclon.io
- **Password**: admin1234
- **Note**: Password must be changed on first login

## Recent Changes (November 26, 2025)
1. Configured Vite to run on port 5000 for Replit compatibility
2. Added HMR client port configuration for Replit proxy
3. Fixed index.html to include module script for React app entry
4. Set up GEMINI_API_KEY environment variable
5. Updated .gitignore for Node.js and Replit
6. Configured static site deployment

## Notes
- App uses localStorage for all data persistence
- Custom Designer font loaded from /public/fonts/
- Dark theme is default, with light theme toggle available
- All user data is client-side only (no backend database)
