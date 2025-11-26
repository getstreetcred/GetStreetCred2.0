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
- Database: PostgreSQL via Drizzle ORM (configured but minimal schema)
- Deployment: Replit environment

## User Preferences

Preferred communication style: Simple, everyday language.

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
- Credential-based sessions for authentication (configured but not fully implemented)

**Responsive Layout System**
- Mobile-first approach using Tailwind breakpoints
- Container max-width strategy: `max-w-7xl` for main content
- Custom hook `useIsMobile()` for responsive behavior
- Grid-based project display: 1 column (mobile) → 2 columns (tablet) → 3 columns (desktop)

### Backend Architecture

**Express Server with TypeScript**
- Development server: Vite dev server with HMR for fast development
- Production server: Pre-built static assets served via Express
- Route registration pattern in `/server/routes.ts` (minimal implementation)
- Logging middleware for request/response tracking

**Storage Abstraction Layer**
- Interface-based storage design (`IStorage`) enables swapping implementations
- Current implementation: In-memory storage (`MemStorage`) for development
- Designed to support database storage via Drizzle ORM
- CRUD methods for user management (getUser, getUserByUsername, createUser)

**Development vs Production Split**
- `index-dev.ts`: Vite middleware integration for hot module replacement
- `index-prod.ts`: Static file serving from `/dist/public`
- Environment-based configuration via NODE_ENV

### Data Layer

**Drizzle ORM Integration**
- PostgreSQL dialect configured via `@neondatabase/serverless` driver
- Schema definition in `/shared/schema.ts` (currently minimal: users table only)
- Zod schema validation using `drizzle-zod` for type-safe inserts
- Migration output directory: `/migrations`
- Database credentials from `DATABASE_URL` environment variable

**Current Schema**
- `users` table: id (UUID), username (unique), password (hashed - implementation pending)
- Schema designed for expansion with projects, ratings, reviews, categories

**Type Safety**
- TypeScript types inferred from Drizzle schema (`typeof users.$inferSelect`)
- Zod schemas for runtime validation of insert operations
- Shared types between frontend and backend via `/shared` directory

### Routing & Navigation

**Client-Side Routing**
- Wouter for lightweight, hook-based routing
- Current routes: Home (`/`), 404 fallback
- Navigation via smooth scrolling to section IDs for single-page experience
- Link components with test IDs for automated testing

**Server-Side Routing**
- API routes prefixed with `/api` (convention, not enforced)
- Catch-all route serves React SPA for client-side routing
- Static asset serving from Vite build output

### UI/UX Patterns

**Modal-Based Interactions**
- Authentication modal with tab switching (sign in/sign up)
- Project detail modal for ratings and reviews
- Radix Dialog primitives for accessible modal behavior

**Category Filtering**
- Horizontal scrollable category filter bar
- Categories: Skyscrapers, Bridges, Airports, Railways, Stadiums, Residential
- Icons from lucide-react library

**Rating System**
- 5-star rating display with half-star support
- Interactive star selection in project detail modal
- Optional text review submission

**Content Sections**
- Hero section: Featured project with large imagery and gradient overlays
- Trending section: Grid of recent/popular projects
- Top-rated section: Ranked list with special styling for top 3 positions

## External Dependencies

### UI Component Libraries
- **shadcn/ui**: Pre-built accessible components (configured via `components.json`)
- **Radix UI**: Unstyled, accessible component primitives (20+ primitives installed)
- **Lucide React**: Icon library for UI elements
- **React Icons**: Additional icon sets (SiGoogle, SiGithub, etc.)

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
- **Drizzle ORM**: Type-safe ORM for PostgreSQL
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **drizzle-zod**: Automatic Zod schema generation from Drizzle schemas
- **connect-pg-simple**: PostgreSQL session store for Express (configured but not active)

### Development Tools
- **Vite**: Build tool and dev server
- **esbuild**: JavaScript bundler for production builds
- **tsx**: TypeScript execution for development
- **Replit Plugins**: Cartographer (code mapping), dev banner, error overlay

### Utility Libraries
- **date-fns**: Date manipulation and formatting
- **embla-carousel-react**: Carousel/slider component
- **cmdk**: Command palette component
- **nanoid**: Unique ID generation
- **Wouter**: Lightweight React router (~1KB)

### Asset Management
- Stock images stored in `/attached_assets/stock_images/` for infrastructure projects
- Images imported directly in components via Vite aliases
- Custom fonts: DM Sans, Space Grotesk, Fira Code, Geist Mono (loaded via Google Fonts)

### Authentication (Planned)
- Session-based authentication infrastructure in place
- Social login UI prepared (Google, GitHub buttons)
- Password hashing and JWT not yet implemented
- User schema exists but authentication flow incomplete