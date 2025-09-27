# Security Architecture - Jenga Biz Platform

## Overview

The Jenga Biz platform implements a comprehensive multi-layered security architecture built on Supabase Auth with custom Row Level Security (RLS) policies, role-based access control (RBAC), and audit trail mechanisms. This document provides an in-depth analysis of all security components and their interactions.

> NOTE: Recent additions include an application settings mechanism (`app_settings`) and an organization approval workflow for ecosystem enabler signups. See the "Approval Workflow" section for details.

## Table of Contents

1. [Authentication Layer](#authentication-layer)
2. [Authorization & Role-Based Access Control](#authorization--role-based-access-control)
3. [Row Level Security (RLS) Policies](#row-level-security-rls-policies)
4. [Security Functions & Triggers](#security-functions--triggers)
5. [Audit Trail System](#audit-trail-system)
6. [Data Protection Mechanisms](#data-protection-mechanisms)
7. [Security Best Practices](#security-best-practices)
8. [Threat Model & Mitigations](#threat-model--mitigations)
9. [Security Monitoring](#security-monitoring)
10. [Approval Workflow & System Settings](#approval-workflow--system-settings)

---

## Authentication Layer

### Supabase Auth Integration

**Provider**: Supabase Auth  
**Configuration**: `supabase/config.toml`

- Email-based authentication with confirmation required
- Password reset functionality via secure tokens
- JWT token-based session management

## Authorization & Role-Based Access Control

(unchanged) - core role hierarchy remains: entrepreneur, hub_manager, admin, super_admin

## Approval Workflow & System Settings

### Motivation
Ecosystem enabler (organization) signups often require manual review. To support both automated and manual workflows the platform provides:

- A small key/value settings table `app_settings` for toggles (e.g., automatic approval)
- A pending approvals pattern where newly created organization profiles can be queued for manual review by super admins

### app_settings (example)

A lightweight table to persist system flags used by the application UI:

```sql
CREATE TABLE public.app_settings (
  key text PRIMARY KEY,
  value text,
  updated_at timestamptz DEFAULT now()
);
```

Common usage examples:
- Key: `auto_approve_organizations`, Value: `true` | `false`

Access to change this setting should be restricted to super_admins only (enforced at application and DB layer).

### Signup behavior (current implementation)
- When a user signs up and selects "Ecosystem Enabler / Organization" the application will:
  - Create an auth user and a minimal profile record with `account_type = 'organization'`.
  - Query `app_settings.auto_approve_organizations`. If `false` the profile remains in a pending/disabled state and the user is shown a notification that their account is pending review.
  - If `true`, the profile behaves like a normal active organization account.

### Pending approvals table (recommended)
For an explicit approval queue, add a `pending_approvals` table and a simple super-admin UI to review/approve/reject entries. Example schema:

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

- Approval actions should be performed via secure stored procedures that record the acting user and write to an audit table.

## Role Management & Super Admin Protections

- Super admin assignment must be gated behind secure functions (e.g., `add_user_role_with_audit`) which perform permission checks and persist audit records.
- The SaaS (hub-manager/admin) UI intentionally hides the `super_admin` role and prohibits assigning it (UI + server-side checks are required).

## Audit Trail & Monitoring

- All role changes, approvals, and setting changes must be logged to audit tables (e.g., `role_change_audit`, `settings_audit`).
- Stored procedures that perform sensitive operations should write a record into `role_change_audit` or `settings_audit` describing the action, requester, IP, and user agent.

## RLS & Enforcement Patterns

- Enforce that only super_admins can mutate `app_settings` or approve pending_orgs via RLS policies or restricted stored procedures.
- Ensure UI-level checks are mirrored by server-side checks: never trust client-only controls.

## Operational notes

- If `app_settings` table is not present in a given environment the application gracefully falls back to conservative defaults (e.g., `auto_approve_organizations = false`).
- Implement database migrations for `app_settings` and `pending_approvals` in `supabase/migrations/` and include example upsert functions for maintainers.

---

Other sections of the original Security Architecture remain relevant. The additions above document the new approval/settings flow and how to secure it.

*Document Version: 1.1*  
*Last Updated: 2025-09-24*  
*Author: Kemosabi*  
