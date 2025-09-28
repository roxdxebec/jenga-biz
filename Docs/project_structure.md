# Project Structure

This document outlines the folder structure, file organization patterns, and architectural decisions for the Jenga Biz Africa platform.

## Root Directory Structure

```
jenga-biz/
├── src/                          # Source code (React + TypeScript)
├── supabase/                     # Supabase configuration and migrations
├── Docs/                         # Project documentation
├── public/                       # Static assets
├── dist/                         # Production build output (generated)
├── node_modules/                 # Dependencies (generated)
├── .env                          # Environment variables (local)
├── package.json                  # Project dependencies and scripts
├── vite.config.ts                # Vite build configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── eslint.config.js              # ESLint configuration
└── WARP.md                       # Warp AI guidance documentation
```

## Source Code Organization (`src/`)

### Application Entry Points
```
src/
├── main.tsx                     # Application entry point
├── App.tsx                      # Main app component with routing and providers
├── index.css                    # Global styles and CSS variables
└── vite-env.d.ts                # Vite type definitions
```

### Component Architecture
```
src/components/
├── ui/                          # shadcn/ui primitive components
│   ├── button.tsx               # Button component
│   ├── card.tsx                 # Card component
│   ├── dialog.tsx               # Modal/Dialog component
│   ├── form.tsx                 # Form components
│   ├── table.tsx                # Table components
│   └── [other-ui-components]    # Additional UI primitives
├── auth/                        # Authentication components
│   ├── AuthDialog.tsx           # Login/signup modal
│   ├── EnhancedAuthDialog.tsx   # Advanced auth with invite codes and approval flow
│   └── InviteCodeManager.tsx    # Admin invite code management
├── dashboard/                   # Dashboard components
│   ├── AdminDashboard.tsx       # Admin/ecosystem builder dashboard (super-admin UI lives here)
│   └── UserManagement.tsx       # User role management interface (supports SaaS hide/filters)
├── analytics/                   # Analytics and reporting components
│   ├── AnalyticsDashboard.tsx   # Main analytics dashboard (supports deep-linking to panels)
│   ├── BusinessIntelligenceDashboard.tsx # BI dashboard
│   ├── FinancialInsightsDashboard.tsx    # Financial analytics
│   └── [other-analytics]        # Additional analytics components
└── [business-components]/       # Business logic components
    ├── UserDashboard.tsx        # Main user dashboard
    ├── StrategyBuilder.tsx      # Business strategy builder
    ├── Templates.tsx            # Strategy templates page
    └── [other-business-components]   # Additional business components
```

### Pages and Routing
```
src/pages/
├── Index.tsx                    # Landing page
├── Profile.tsx                  # User profile management
├── Templates.tsx                # Business templates page (/templates)
├── Strategy.tsx                 # Strategy building page (/strategy)
├── Home.tsx                     # Home page
├── PasswordReset.tsx            # Password reset page
└── NotFound.tsx                 # 404 error page
```

Important routes used by the platform:
- `/saas` — Ecosystem enabler dashboard (hub managers & admins)
- `/super-admin` — Super admin console (system settings & approvals)
- `/b2c` — B2C entrepreneur-facing area

## App Settings & Approval Workflow

This project stores lightweight system settings and supports an approval workflow for organization (ecosystem enabler) signups.

- `app_settings` (supabase table) — key/value settings (example: `auto_approve_organizations`) used by AdminDashboard to control automatic activation of organization accounts.
- Organization signups: when a user registers as an "Ecosystem Enabler" the platform will create a profile with `account_type = 'organization'`. By default the account remains in a pending/disabled state until a super admin approves it, unless `auto_approve_organizations` is enabled.

Note: The UI and backend expect the `app_settings` table (or an equivalent mechanism) for persisting these settings. Approval review UI can be found (or extended) in the Super Admin dashboard.

## Business Logic and State Management
```
src/hooks/
├── useAuth.tsx                  # Authentication state management
├── useStrategy.tsx              # Business strategy operations
├── useAnalytics.tsx             # Analytics data fetching
├── useBusinessIntelligence.tsx  # BI data operations
├── useFinancialInsights.tsx     # Financial analytics
├── useImpactMeasurement.tsx     # Impact tracking
├── use-mobile.tsx               # Mobile detection hook
└── use-toast.tsx                # Toast notifications
```

## Utility Functions and Services
```
src/lib/
├── utils.ts                     # General utility functions
├── profile.ts                   # Profile upsert and normalization helpers
└── [others]
```

## Data Integration Layer
```
src/integrations/
└── supabase/
    ├── client.ts                # Supabase client configuration
    └── types.ts                 # Generated TypeScript types from database
```

## Supabase Backend Structure

### Database Migrations
```
supabase/migrations/
├── [timestamp]_[description].sql # Migration files (profiles, roles, hubs, settings, analytics, etc.)
```

### App Settings Table (recommended)

A minimal settings table is used by the frontend to persist small flags:

```sql
CREATE TABLE public.app_settings (
  key text PRIMARY KEY,
  value text,
  updated_at timestamptz DEFAULT now()
);
```

### Approval Workflow (recommended)

To support explicit approval flows we recommend a `pending_approvals` table where new organization signups are queued for review by super admins.

```sql
CREATE TABLE public.pending_approvals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  payload jsonb,
  status text DEFAULT 'pending', -- pending | approved | rejected
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz
);
```

### Edge Functions
```
supabase/functions/
├── send-password-reset/         # Password reset email service
└── send-signup-confirmation/    # Signup confirmation email service
```

## Documentation Structure

```
Docs/
├── PRD.md                      # Product Requirements Document
├── Stories.md                  # Detailed feature stories
├── Implementation.md           # Implementation analysis and gaps
├── project_structure.md        # This file - project organization
├── SecurityArchitecture.md     # Security architecture & policies
└── [additional-docs]/          # Future documentation files
```

## Configuration Files

- `vite.config.ts` - Vite configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript config
- `package.json` - Scripts and dependencies

## Development Workflow Structure

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run lint` - Linting

## Integration Points

- **Supabase**: DB, Auth, Edge Functions
- **Vercel / Netlify**: Deployments

This structure supports the platform's dual nature as a B2C entrepreneur tool and a B2B ecosystem builder platform and documents the approval/settings pieces added in recent iterations.
