-- Core types and enums (idempotent)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'approval_status') THEN
        CREATE TYPE "public"."approval_status" AS ENUM (
            'pending',
            'approved',
            'rejected',
            'expired',
            'cancelled'
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'business_stage') THEN
        CREATE TYPE "public"."business_stage" AS ENUM (
            'idea',
            'launch',
            'growth',
            'scale'
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'milestone_type') THEN
        CREATE TYPE "public"."milestone_type" AS ENUM (
            'business_registration',
            'first_customer',
            'first_hire',
            'break_even',
            'loan_application',
            'investment_ready'
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE "public"."user_role" AS ENUM (
            'entrepreneur',
            'hub_manager',
            'admin',
            'super_admin'
        );
    END IF;
END $$;

COMMENT ON SCHEMA "public" IS 'standard public schema';
