# GetStreetCred - Modern Infrastructure Rating Platform

## Overview

GetStreetCred is a social platform for discovering, showcasing, and rating modern infrastructure projects worldwide. The application combines elements of project showcasing (like Behance), community voting (like Product Hunt), and visual-first content presentation (like Instagram) to create an engaging experience for infrastructure enthusiasts.

**Core Purpose**: Enable users to explore iconic infrastructure projects (bridges, skyscrapers, airports, stadiums) through high-quality imagery, community ratings, and detailed project information.

**Technology Stack**:
- Frontend: React 18 with TypeScript, Vite build tool
- UI Framework: shadcn/ui components with Radix UI primitives
- Styling: Tailwind CSS with custom dark theme
- Routing: Wouter (lightweight React router)
- State Management: TanStack React Query
- Backend: Express.js with TypeScript
- Database: PostgreSQL via Supabase
- Deployment: Replit environment

## User Preferences

Preferred communication style: Simple, everyday language.
Database: Supabase only (no mixing with local PostgreSQL)

## System Architecture

### Frontend Architecture

**Component-Based Design with shadcn/ui**
- Uses shadcn/ui component library built on Radix UI primitives for accessible, customizable UI components
- Component organization follows feature-based structure with shared UI components in `/client/src/components/ui`
- Custom components for domain features in `/client/src/components` (Navbar, Footer, ProjectCard, etc.)
- Path aliases configured for clean imports: `@/` for client source, `@shared/` for shared code, `@assets/` for static assets

**Dark-First Visual Design**
- Primary dark theme with yellow (#fbbf24) as accent color for CTAs and interactive elements
- Image-first content presentation optimized for infrastructure photography
- Custom CSS variables system for theming (light/dark modes supported)
- Typography: Inter for body text, Space Grotesk for display headlines, monospace for code

**State Management Strategy**
- TanStack Query for server state and API data fetching
- Local component state with React hooks for UI interactions
- Query client configured with custom fetch wrapper for API requests
- Authentication state managed via context (AuthContext)

**Responsive Layout System**
- Mobile-first approach using Tailwind breakpoints
- Container max-width strategy: `max-w-7xl` for main content
- Custom hook `useIsMobile()` for responsive behavior
- Grid-based project display: 1 column (mobile) → 2 columns (tablet) → 3 columns (desktop)

### Backend Architecture

**Express Server with TypeScript**
- Development server: Vite dev server with HMR for fast development
- Production server: Pre-built static assets served via Express
- Route registration pattern in `/server/routes.ts` with API endpoints
- Request/response transformation: snake_case ↔ camelCase conversion for Supabase compatibility
- Logging middleware for request/response tracking

**Storage Abstraction Layer**
- Interface-based storage design (`IStorage`) with Supabase implementation
- Current implementation: Supabase PostgreSQL client for all data operations
- CRUD methods for users, projects, and ratings
- All operations delegated to Supabase cloud database

**Development vs Production Split**
- `index-dev.ts`: Vite middleware integration for hot module replacement
- `index-prod.ts`: Static file serving from `/dist/public`
- Environment-based configuration via NODE_ENV

### Data Layer

**Supabase PostgreSQL**
- Direct Supabase client integration via `@supabase/supabase-js`
- Schema definition in `/shared/schema.ts` with Drizzle ORM types
- Zod schema validation for type-safe operations
- Environment variables: `SUPABASE_URL` and `SUPABASE_ANON_KEY`

**Database Schema**
- `users` table: id (UUID), username (unique), password (plain text), role (user/admin)
- `projects` table: id (UUID), name, location, description, image_url, category, completion_year, rating, rating_count, user_id (creator), created_at
- `ratings` table: id (UUID), project_id, user_id, rating (1-5), review (optional), created_at

**Type Safety**
- TypeScript types inferred from Drizzle schema
- Zod schemas for runtime validation of insert operations
- Shared types between frontend and backend via `/shared` directory
- camelCase used in frontend, snake_case in Supabase, automatic conversion in routes

### Authentication & Authorization

**Role-Based Access Control**
- Admin role: Automatically assigned to accounts with email `admin@getstreetcred.com`
- User role: Default role for all other accounts
- Role field stored in users table and returned on signin/signup

**Permissions System**
- **Admins**: Can edit and delete any project in the system
- **Regular users**: Can only edit/delete projects they created
- Permission checks enforced on both frontend (UI) and backend (API)
- Edit/Delete buttons only visible to authorized users in project detail modal

**Authentication Flow**
- Email/password signup and signin (no hashing yet, plain text passwords)
- Auth context maintains user state with id, email, and role
- Sessions managed on frontend (localStorage/context), no server-side sessions currently
- API routes verify userId and userRole from request body for permission checks

### Routing & Navigation

**Client-Side Routing**
- Wouter for lightweight, hook-based routing
- Current routes: Home (`/`), 404 fallback
- Navigation via smooth scrolling and modal-based project viewing
- Link components with test IDs for automated testing

**Server-Side Routing**
- API routes: `/api/projects`, `/api/ratings`, `/api/auth/*`
- Request transformation middleware converts camelCase to snake_case for Supabase queries
- Response transformation converts snake_case from Supabase back to camelCase for frontend
- Permission checks on PATCH/DELETE project endpoints

### UI/UX Patterns

**Modal-Based Interactions**
- Authentication modal with tab switching (sign in/sign up)
- Project detail modal for ratings, reviews, and editing
- Add/Edit project modal for project creation and modification
- Radix Dialog primitives for accessible modal behavior

**Category Filtering**
- Horizontal scrollable category filter bar
- Categories: Skyscrapers, Bridges, Airports, Railways, Stadiums, Residential, Hotel & Casino, Tower, Urban Development
- Icons from lucide-react library

**Rating System**
- 5-star rating display with interactive star selection
- Aggregate rating calculation after each new rating
- Optional text review submission
- Only authenticated users can rate projects

**Content Sections**
- Hero section: Featured project with large imagery and gradient overlays
- Trending section: Grid of recent/popular projects with location/category filtering
- Top-rated section: Ranked list with special styling for top 3 positions
- Location-based discovery with autocomplete dropdown

**Project Management**
- Create: Any logged-in user can add new infrastructure projects
- Edit: Only project creators or admins can edit
- Delete: Only project creators or admins can delete
- Edit/Delete buttons only visible to authorized users

## Recent Changes (November 27, 2025)

**Admin System Implementation**
- Added `role` column to users table (default: "user")
- Added `user_id` column to projects table to track project creator
- Implemented admin auto-detection: anyone signing up with `admin@getstreetcred.com` becomes admin
- Backend permission checks on edit/delete endpoints
- Frontend permission checks hide edit/delete buttons from unauthorized users
- Supabase integration: All data stored in Supabase PostgreSQL database
- Frontend/Backend API data transformation: Supabase uses snake_case, frontend uses camelCase

## External Dependencies

### UI Component Libraries
- **shadcn/ui**: Pre-built accessible components
- **Radix UI**: Unstyled, accessible component primitives
- **Lucide React**: Icon library for UI elements
- **React Icons**: Additional icon sets

### Styling & Design
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **class-variance-authority**: Component variant management
- **tailwind-merge & clsx**: Conditional class name utilities
- **Autoprefixer**: CSS vendor prefix automation

### Data Fetching & Forms
- **TanStack Query v5**: Server state management and caching
- **React Hook Form**: Form validation and management
- **Hookform Resolvers**: Zod resolver for form validation
- **Zod**: Runtime type validation

### Database & Backend
- **Supabase**: Hosted PostgreSQL database and client library
- **@supabase/supabase-js**: Supabase JavaScript client
- **drizzle-zod**: Zod schema generation from Drizzle types

### Development Tools
- **Vite**: Build tool and dev server
- **esbuild**: JavaScript bundler for production builds
- **tsx**: TypeScript execution for development
- **Replit Plugins**: Cartographer, dev banner, error overlay

### Utility Libraries
- **date-fns**: Date manipulation and formatting
- **embla-carousel-react**: Carousel/slider component
- **cmdk**: Command palette component
- **Wouter**: Lightweight React router
- **postgres**: PostgreSQL client library for migrations

### Asset Management
- Stock images stored in `/attached_assets/stock_images/` for infrastructure projects
- Images imported directly in components via Vite aliases
- Custom fonts: DM Sans, Space Grotesk, Fira Code, Geist Mono (Google Fonts)
