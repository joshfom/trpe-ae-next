# TRPE Next.js Platform

A comprehensive real estate platform built with Next.js, featuring property management, agent portals, CRM functionality, and a dedicated luxury division.

## Project Overview

This is a full-stack real estate platform that manages properties, agents, communities, and client relationships. The platform includes a separate **Luxe** division for high-end luxury properties, operating as a distinct entity within the system.

## Core Modules & Entities

### 🏠 **Properties**
- Property listings and management
- Property images and media handling
- Property types and amenities
- Off-plan developments
- Floor plans and unit types

### 🏘️ **Communities**
- Community management
- Sub-communities
- Luxe communities (separate luxury entity)
- Community-specific listings

### 👥 **Agents & Teams**
- Agent profiles and management
- Team structure and departments
- Multi-language support
- Agent-specific dashboards

### 💼 **CRM System**
- Lead management
- Contact forms and callbacks
- Client relationship tracking
- Activity logging

### 📊 **Admin & Analytics**
- Administrative dashboards
- Property insights
- Performance analytics
- Content management

### 🌟 **Luxe Division**
The platform features a **separate Luxe division** that operates as its own entity, handling:
- High-end luxury properties
- Exclusive luxury communities
- Premium agent services
- Specialized luxury property features

## Technical Stack

### Frontend
- **[Next.js 15](https://nextjs.org)** with App Router - Full-stack React framework
- **[React 19](https://react.dev)** with TypeScript - UI library with type safety
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library for React
- **[TipTap](https://tiptap.dev)** - Headless rich text editor
- **[Lucide React](https://lucide.dev)** - Icon library
- **[Radix UI](https://www.radix-ui.com)** - Low-level UI primitives

### Backend & Database
- **[PostgreSQL](https://www.postgresql.org)** - Robust relational database
- **[Drizzle ORM](https://orm.drizzle.team)** - TypeScript ORM with excellent type safety and performance
- **[Hono.js](https://hono.dev)** - Fast and lightweight web framework
  - *Why Hono?* Ultra-fast performance with built-in TypeScript support, perfect for API routes that need to be both fast and type-safe. Hono provides excellent developer experience with automatic type inference and minimal overhead.
- **[Better Auth](https://www.better-auth.com)** - Modern authentication solution
- **[EdgeStore](https://edgestore.dev)** - File storage and CDN solution

### State Management & Data Fetching
- **[TanStack Query](https://tanstack.com/query)** - Powerful data synchronization for React
- **[Zustand](https://zustand-demo.pmnd.rs)** - Lightweight state management
- **[Jotai](https://jotai.org)** - Atomic state management
- **[React Hook Form](https://react-hook-form.com)** - Performant forms with easy validation

### Development & Build Tools
- **[TypeScript](https://www.typescriptlang.org)** - Static type checking
- **[Drizzle Kit](https://orm.drizzle.team/kit-docs/overview)** - Database migrations and introspection
- **[Bun](https://bun.sh)** - Fast JavaScript runtime and package manager
- **[ESLint](https://eslint.org)** - Code linting and formatting

### Key Features
- **Multi-language support**
- **Advanced search and filtering**
- **Image optimization and galleries**
- **SEO-optimized pages**
- **Mobile-responsive design**
- **Real-time updates**

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
- PostgreSQL database
- Environment variables configured

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd trpe-next

# Install dependencies
bun install
# or
npm install

# Set up environment variables
cp .env.example .env.local

# Run database migrations
bun run db:migrate

# Start development server
bun dev
# or
npm run dev
```

### Development Scripts

```bash
# Development with increased memory
bun dev

# Database operations
bun run db:generate    # Generate migrations
bun run db:migrate     # Run migrations
bun run db:studio      # Open Drizzle Studio
bun run db:push        # Push schema changes

# Build and deployment
bun run build
bun run start
bun run lint
```

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (site)/            # Main site pages
│   ├── admin/             # Admin dashboard
│   ├── crm/               # CRM interface
│   ├── luxe/              # Luxe division (separate entity)
│   └── api/               # API routes
├── actions/               # Server actions
│   ├── agents/            # Agent-related actions
│   ├── community/         # Community management
│   ├── crm/               # CRM operations
│   ├── properties/        # Property management
│   └── admin/             # Admin operations
├── db/                    # Database configuration
│   ├── schema/            # Database schema files
│   └── migrations/        # Database migrations
├── components/            # Reusable React components
├── lib/                   # Utility functions
└── types/                 # TypeScript type definitions
```

## Database Entities

The platform manages various entities including:
- Properties, Buildings, Developments
- Agents, Teams, Departments
- Communities, Sub-communities
- Leads, Contacts, Notes
- Media, Images, Floor Plans
- Payment Plans, Offer Types
- Insights, Analytics, Page Metadata

## Environment Configuration

Configure your `.env.local` file with:
- Database connection strings
- Authentication secrets
- Third-party API keys
- File storage configuration

## Deployment

The platform is optimized for deployment on Vercel with:
- Automatic builds and deployments
- Environment variable management
- Performance monitoring
- Analytics integration

For detailed deployment instructions, refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).
