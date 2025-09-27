-- Analytics tables
CREATE TABLE IF NOT EXISTS "public"."analytics_summaries" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "metric_type" text,
    "metric_date" date,
    "value" numeric,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "analytics_summaries_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "analytics_summaries_metric_type_metric_date_key" UNIQUE ("metric_type", "metric_date")
);

CREATE TABLE IF NOT EXISTS "public"."milestone_completion_analytics" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "business_id" uuid,
    "user_id" uuid,
    "milestone_id" uuid,
    "completion_date" date,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "milestone_completion_analytics_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "milestone_completion_analytics_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id"),
    CONSTRAINT "milestone_completion_analytics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id")
);
