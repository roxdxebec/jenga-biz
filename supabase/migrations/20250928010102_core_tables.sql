-- Core tables
CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" uuid NOT NULL,
    "email" text,
    "full_name" text,
    "account_type" text,
    "organization_name" text,
    "country" text,
    "is_profile_complete" boolean,
    "created_at" timestamp with time zone DEFAULT now(),
    "updated_at" timestamp with time zone DEFAULT now(),
    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE,
    CONSTRAINT "profiles_account_type_check" CHECK (("account_type" = ANY (ARRAY['business'::text, 'organization'::text])))
);

CREATE TABLE IF NOT EXISTS "public"."user_roles" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "user_id" uuid NOT NULL,
    "role" "public"."user_role" NOT NULL,
    "hub_id" uuid,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "user_roles_user_id_role_key" UNIQUE ("user_id", "role"),
    CONSTRAINT "user_roles_hub_id_fkey" FOREIGN KEY ("hub_id") REFERENCES "public"."hubs"("id")
);
