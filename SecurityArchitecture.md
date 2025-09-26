# Security Architecture - Jenga Biz Platform

## Overview

The Jenga Biz platform implements a comprehensive multi-layered security architecture built on Supabase Auth with custom Row Level Security (RLS) policies, role-based access control (RBAC), and audit trail mechanisms. This document provides an in-depth analysis of all security components and their interactions.

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

---

## Authentication Layer

### Supabase Auth Integration

**Provider**: Supabase Auth  
**Configuration**: `supabase/config.toml`

```toml
[auth]
enabled = true
site_url = "https://jengabiz.africa"
additional_redirect_urls = [
  "https://jengabiz.africa/auth", 
  "https://jengabiz.africa/reset-password"
]
email_double_confirm_changes_enabled = false

[auth.email]
enable_confirmations = true
double_confirm_changes_enabled = false
```

### Authentication Features

- **Email-based authentication** with confirmation required
- **Password reset functionality** via secure tokens
- **Multi-domain support** for development and production environments
- **JWT token-based** session management
- **Automatic session refresh** and expiry handling

---

## Authorization & Role-Based Access Control

### Role Hierarchy

The platform implements a four-tier role hierarchy:

```sql
CREATE TYPE user_role AS ENUM (
  'entrepreneur',    -- Level 1: Basic user access
  'hub_manager',     -- Level 2: Hub administration
  'admin',          -- Level 3: System administration
  'super_admin'     -- Level 4: Full system control
);
```

#### Role Definitions

| Role | Level | Permissions | Scope |
|------|-------|-------------|-------|
| **entrepreneur** | 1 | - View/edit own profile<br/>- Create/manage own businesses<br/>- Access templates and resources<br/>- Track personal milestones | Personal data only |
| **hub_manager** | 2 | - All entrepreneur permissions<br/>- Manage hub-assigned businesses<br/>- View hub analytics<br/>- Assign businesses to hub | Hub-scoped data |
| **admin** | 3 | - All hub_manager permissions<br/>- Manage user roles<br/>- System-wide analytics<br/>- Platform configuration | System-wide (limited) |
| **super_admin** | 4 | - All admin permissions<br/>- Full database access<br/>- Security configuration<br/>- User management | Unrestricted access |

### Role Assignment Architecture

#### Core Table: `user_roles`

```sql
CREATE TABLE public.user_roles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  role user_role DEFAULT 'entrepreneur',
  hub_id uuid REFERENCES public.hubs(id),
  created_at timestamptz DEFAULT now()
);
```

#### Multi-Role Support

- **Users can have multiple roles** simultaneously
- **Hub-scoped roles** for regional management
- **Role inheritance** (higher roles include lower permissions)
- **Temporal role tracking** with creation timestamps

---

## Row Level Security (RLS) Policies

All tables in the platform have RLS enabled with sophisticated policies controlling data access.

### Core RLS Policies

#### 1. User Roles Table Policies

```sql
-- Policy: "Admins can manage user roles"
CREATE POLICY "Admins can manage user roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::user_role) OR 
         has_role(auth.uid(), 'super_admin'::user_role));

-- Policy: "Users can view their own roles" 
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING ((user_id = auth.uid()) OR is_admin_or_hub_manager(auth.uid()));
```

#### 2. Profiles Table Policies

- **Self-access**: Users can always view/edit their own profiles
- **Admin oversight**: Admins can view all profiles for support purposes
- **Hub manager scope**: Hub managers can view profiles of users in their hubs

#### 3. Business Data Policies

- **Owner access**: Business owners have full CRUD access to their businesses
- **Hub manager oversight**: Hub managers can view/edit businesses assigned to their hubs
- **Admin monitoring**: Admins have read access for analytics and support

#### 4. Analytics & Audit Policies

- **Restricted write access**: Only system functions can write to audit tables
- **Role-based read access**: Analytics data visibility based on user role level
- **Data isolation**: Users can only see analytics related to their scope

### RLS Implementation Pattern

```sql
-- Standard RLS pattern used across the platform
CREATE POLICY "policy_name" ON table_name
  FOR operation TO authenticated
  USING (
    -- Self-access condition
    (user_id = auth.uid()) OR 
    -- Role-based condition
    has_role(auth.uid(), 'required_role'::user_role) OR
    -- Scoped access condition
    is_in_user_scope(auth.uid(), record_scope)
  );
```

---

## Security Functions & Triggers

### Core Security Functions

#### 1. Role Checking Functions

```sql
-- Check if user has specific role
CREATE FUNCTION has_role(user_id uuid, required_role user_role)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = $1 AND role = $2
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is admin or hub manager
CREATE FUNCTION is_admin_or_hub_manager(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN has_role(user_id, 'admin'::user_role) OR 
         has_role(user_id, 'super_admin'::user_role) OR
         has_role(user_id, 'hub_manager'::user_role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### 2. Role Management Functions

```sql
-- Secure role addition with audit trail
CREATE FUNCTION add_user_role_with_audit(
  target_user_id uuid,
  new_role user_role,
  hub_id uuid DEFAULT NULL
) RETURNS uuid AS $$
-- Implementation includes permission checks and audit logging
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Secure role removal with audit trail
CREATE FUNCTION remove_user_role_with_audit(
  target_user_id uuid,
  role_to_remove user_role
) RETURNS boolean AS $$
-- Implementation includes permission checks and audit logging
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### 3. Super Admin Setup Function

```sql
CREATE FUNCTION setup_super_admin(admin_email text)
RETURNS uuid AS $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Get the user ID for the provided email
    SELECT id INTO admin_user_id FROM auth.users WHERE email = admin_email;
    
    IF admin_user_id IS NULL THEN
        RAISE EXCEPTION 'User with email % not found', admin_email;
    END IF;
    
    -- Insert super_admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'super_admin'::user_role)
    ON CONFLICT (user_id, role) DO NOTHING;
    
    -- Also add admin role for broader permissions
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin'::user_role)
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RETURN admin_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Security Triggers

#### 1. Role Manipulation Prevention

```sql
-- Trigger function to prevent direct role manipulation
CREATE FUNCTION prevent_direct_role_manipulation()
RETURNS trigger AS $$
BEGIN
  -- Allow secure functions to operate
  IF current_setting('application_name', true) = 'secure_role_function' THEN
    RETURN COALESCE(NEW, OLD);
  END IF;
  
  -- Block direct INSERT/UPDATE/DELETE operations on user_roles
  RAISE EXCEPTION 'Direct manipulation of user_roles table is not allowed. Use add_user_role_with_audit() or remove_user_role_with_audit() functions.';
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to user_roles table
CREATE TRIGGER prevent_direct_role_changes
    BEFORE INSERT OR UPDATE OR DELETE ON public.user_roles
    FOR EACH ROW EXECUTE FUNCTION prevent_direct_role_manipulation();
```

#### 2. Automatic Timestamp Updates

```sql
-- Auto-update timestamps on record changes
CREATE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Applied to all tables with updated_at columns
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## Audit Trail System

### Role Change Auditing

#### Audit Table: `role_change_audit`

```sql
CREATE TABLE public.role_change_audit (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp timestamptz DEFAULT now(),
  changed_by_user_id uuid NOT NULL,
  target_user_id uuid NOT NULL,
  old_role user_role,
  new_role user_role NOT NULL,
  action_type text CHECK (action_type IN ('add', 'remove')),
  ip_address inet,
  user_agent text
);
```

### User Activity Tracking

#### Activity Logging: `user_activities`

```sql
CREATE TABLE public.user_activities (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  activity_type text NOT NULL,
  activity_data jsonb DEFAULT '{}',
  ip_address inet,
  user_agent text,
  country_code text,
  region text,
  city text,
  created_at timestamptz DEFAULT now()
);
```

**Current Activity Volume**: 237,933 records

#### Journey Analytics: `user_journey_analytics`

```sql
CREATE TABLE public.user_journey_analytics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  session_id text NOT NULL,
  page_path text NOT NULL,
  action_type text NOT NULL,
  action_data jsonb DEFAULT '{}',
  user_agent text,
  referrer text,
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);
```

**Current Analytics Volume**: 201,533 records

---

## Data Protection Mechanisms

### 1. Input Validation & Sanitization

- **Database constraints** on all user input fields
- **Check constraints** for data integrity
- **Foreign key constraints** for referential integrity
- **JSONB validation** for structured data

### 2. Data Encryption

#### In-Transit Encryption
- **HTTPS/TLS 1.3** for all client-server communication
- **Database connection encryption** via Supabase
- **JWT token encryption** for session data

#### At-Rest Encryption
- **Supabase managed encryption** for database storage
- **Environment variable encryption** for sensitive configuration
- **Password hashing** via Supabase Auth (bcrypt)

### 3. Data Access Controls

#### Geographic Restrictions
```sql
-- Example: Country-based access control
CREATE POLICY "country_access_policy" ON sensitive_data
  FOR SELECT TO authenticated
  USING (country_code = get_user_country(auth.uid()));
```

#### Time-Based Access
```sql
-- Example: Business hours access control
CREATE POLICY "business_hours_policy" ON admin_functions
  FOR ALL TO authenticated
  USING (
    has_role(auth.uid(), 'admin'::user_role) AND
    EXTRACT(hour FROM now() AT TIME ZONE 'UTC') BETWEEN 8 AND 18
  );
```

---

## Security Best Practices

### 1. Principle of Least Privilege

- **Default role**: All new users start as 'entrepreneur'
- **Explicit role assignment** required for elevated privileges
- **Scope-based permissions** limit access to relevant data only
- **Function-level security** with `SECURITY DEFINER` where appropriate

### 2. Defense in Depth

- **Multiple security layers**: Auth + RLS + Application Logic
- **Input validation** at database, application, and client levels
- **Audit trails** for all sensitive operations
- **Rate limiting** on authentication endpoints

### 3. Secure Development Practices

```sql
-- Example: Secure function pattern
CREATE FUNCTION secure_operation(param text)
RETURNS result_type AS $$
BEGIN
  -- 1. Permission check
  IF NOT has_required_permission(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  
  -- 2. Input validation
  IF param IS NULL OR length(param) = 0 THEN
    RAISE EXCEPTION 'Invalid input';
  END IF;
  
  -- 3. Audit logging
  INSERT INTO audit_log (user_id, action, details)
  VALUES (auth.uid(), 'secure_operation', jsonb_build_object('param', param));
  
  -- 4. Core logic
  -- ... implementation ...
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Threat Model & Mitigations

### 1. Authentication Threats

| Threat | Mitigation |
|--------|------------|
| **Brute Force Attacks** | Rate limiting, account lockout, strong password policies |
| **Credential Stuffing** | Email verification, unusual login detection |
| **Session Hijacking** | Secure JWT tokens, short expiry times, HTTPS only |
| **Phishing Attacks** | Domain validation, email templates, user education |

### 2. Authorization Threats

| Threat | Mitigation |
|--------|------------|
| **Privilege Escalation** | Strict role validation, audit trails, function-level checks |
| **Role Manipulation** | Trigger-based protection, audit logging, admin approval |
| **Data Access Bypass** | RLS policies, function security, input validation |
| **Insider Threats** | Audit trails, role separation, regular access reviews |

### 3. Data Threats

| Threat | Mitigation |
|--------|------------|
| **SQL Injection** | Parameterized queries, input validation, RLS |
| **Data Exfiltration** | Access logging, rate limiting, role-based restrictions |
| **Data Manipulation** | Audit trails, backup systems, integrity checks |
| **Data Exposure** | Encryption, access controls, monitoring |

---

## Security Monitoring

### 1. Real-Time Monitoring

#### Activity Monitoring
- **Failed login attempts** tracking
- **Unusual access patterns** detection
- **Role changes** immediate alerting
- **Data export** activity monitoring

#### Geographic Anomalies
```sql
-- Example: Detect unusual login locations
SELECT 
  user_id,
  country_code,
  count(*) as login_count,
  array_agg(DISTINCT ip_address) as ip_addresses
FROM user_activities 
WHERE activity_type = 'login' 
  AND created_at > now() - interval '24 hours'
GROUP BY user_id, country_code
HAVING count(DISTINCT country_code) > 2;
```

### 2. Audit Reports

#### Weekly Security Reports
- **New user registrations** with role assignments
- **Role changes** summary and approvals needed
- **Failed authentication** attempts analysis
- **Data access patterns** review

#### Monthly Security Reviews
- **User access certification** for admin roles
- **Policy effectiveness** analysis
- **Threat landscape** assessment
- **Security metrics** dashboard

### 3. Compliance Monitoring

#### Data Protection Compliance
- **GDPR compliance** for user data
- **Data retention policies** enforcement
- **User consent management** tracking
- **Data export/deletion** request handling

---

## Configuration & Environment

### Security Configuration Files

```bash
# File locations
├── supabase/config.toml          # Supabase configuration
├── .env                          # Environment variables (encrypted)
├── Docs/SecurityArchitecture.md  # This documentation
└── database/
    ├── migrations/               # Security-related migrations
    ├── policies/                # RLS policies
    └── functions/               # Security functions
```

### Environment Variables

```bash
# Security-related environment variables
SUPABASE_URL=https://diclwatocrixibjpajuf.supabase.co
SUPABASE_ANON_KEY=[PROTECTED]
SUPABASE_SERVICE_ROLE_KEY=[PROTECTED]
JWT_SECRET=[PROTECTED]
DATABASE_URL=[PROTECTED]
```

---

## Incident Response Plan

### 1. Security Incident Classification

| Level | Description | Response Time |
|-------|-------------|---------------|
| **Critical** | Data breach, unauthorized admin access | Immediate (< 1 hour) |
| **High** | Role manipulation, failed auth spike | 4 hours |
| **Medium** | Unusual access patterns, policy violations | 24 hours |
| **Low** | Minor security events, routine monitoring | 72 hours |

### 2. Response Procedures

#### Critical Incident Response
1. **Immediate containment** - Disable affected accounts
2. **Impact assessment** - Determine data exposure scope  
3. **Forensic analysis** - Preserve logs and evidence
4. **Notification** - Alert relevant stakeholders
5. **Recovery** - Restore secure operations
6. **Post-incident review** - Update security measures

### 3. Recovery Procedures

#### Account Compromise Recovery
```sql
-- Emergency account lockout procedure
UPDATE auth.users 
SET email_confirmed_at = NULL 
WHERE id = '[COMPROMISED_USER_ID]';

-- Role revocation
DELETE FROM public.user_roles 
WHERE user_id = '[COMPROMISED_USER_ID]';

-- Audit trail preservation
INSERT INTO security_incidents (user_id, incident_type, response_action)
VALUES ('[COMPROMISED_USER_ID]', 'account_compromise', 'emergency_lockout');
```

---

## Conclusion

The Jenga Biz platform implements a comprehensive, multi-layered security architecture that provides:

- **Strong authentication** via Supabase Auth
- **Granular authorization** through role-based access control
- **Data protection** via Row Level Security policies
- **Comprehensive auditing** of all security-relevant events
- **Proactive monitoring** and threat detection
- **Incident response** capabilities

This architecture supports the platform's mission of providing secure, scalable business incubation services while maintaining the highest standards of data protection and user privacy.

---

*Document Version: 1.0*  
*Last Updated: September 24, 2025*  
*Author: System Analysis based on Database Schema*  
*Review Cycle: Quarterly*