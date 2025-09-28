-- Business-related tables
CREATE TABLE IF NOT EXISTS "public"."businesses" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "user_id" uuid,
    "hub_id" uuid,
    "name" text,
    "stage" "public"."business_stage",
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "businesses_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "businesses_hub_id_fkey" FOREIGN KEY ("hub_id") REFERENCES "public"."hubs"("id")
);

CREATE TABLE IF NOT EXISTS "public"."business_milestones" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "business_id" uuid,
    "milestone_type" "public"."milestone_type",
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "business_milestones_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "business_milestones_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE CASCADE
);
