# Jenga Biz Africa - Developer README

Welcome to the Jenga Biz Africa project. This README gives developers a concise starting point to run and understand the repository.

Project URL (preview): https://jenga-biz.vercel.app


Prerequisites
- Node.js (recommended via nvm)
- npm or yarn

Quick start
```bash
# Clone repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start dev server
npm run dev
```

Environment
- Copy environment variables into a local `.env` or set in your host:
  - VITE_SUPABASE_URL
  - VITE_SUPABASE_PUBLISHABLE_KEY
  - SUPABASE_SERVICE_ROLE_KEY (server-side only)
  - DATABASE_URL (migrations)

Important routes
- `/` — Landing page
- `/saas` — Ecosystem Enabler dashboard (hub_manager & admin roles)
- `/super-admin` — Super-admin console (system settings & approvals)
- `/b2c` — Entrepreneur/B2C area
- `/templates` — Strategy templates
- `/strategy` — Strategy builder (start blank)

Notable features
- Role-based access control (entrepreneur, hub_manager, admin, super_admin)
- Organization signup approval workflow (organization accounts may be created in a pending/disabled state and require super-admin approval unless auto-approve is enabled)
- Admin settings include an "Auto-approve Organization Accounts" toggle stored in `app_settings` (persisted in Supabase)
- SaaS dashboard excludes super_admin accounts from aggregated counts and hides super_admin role management in the SaaS user management view
- Analytics dashboard supports deep-linking (e.g. `/saas?tab=analytics&panel=reporting`) to open a specific analytics panel

Project structure
- See `project_structure.md` for an up-to-date layout of the repo and recommended DB tables (including `app_settings` and `pending_approvals` patterns).

Security & approvals
- Organization signups create a basic profile via `src/lib/profile.ts`.
- If `auto_approve_organizations` is false, organization accounts remain pending and the user is notified after signup. Super-admin UI contains settings to toggle auto-approval and should be extended to include an approvals queue.

Development notes
- To add or modify system settings, we persist small flags to `app_settings` (key/value)
- Add DB migrations under `supabase/migrations/` for any schema changes (e.g., `app_settings` or `pending_approvals`)
- Audit-sensitive actions (role changes, approvals) should use stored procedures (e.g., `add_user_role_with_audit`) to enforce permission checks and create audit records

How to contribute
- Open a branch, make changes, run `npm run lint` and ensure type checks
- Push and create a PR. Use the project's CI checks if configured

Where to get help
- Project docs in `Docs/` and `SecurityArchitecture.md`
- For Supabase connection issues open the MCP popover in the project UI or check your environment variables

Thank you for contributing to Jenga Biz Africa.
