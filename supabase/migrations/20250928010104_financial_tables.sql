-- Financial tables
CREATE TABLE IF NOT EXISTS "public"."financial_transactions" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "user_id" uuid,
    "transaction_type" text,
    "amount" numeric,
    "currency" text,
    "transaction_date" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "financial_transactions_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "financial_transactions_transaction_type_check" CHECK (("transaction_type" = ANY (ARRAY['income'::text, 'expense'::text])))
);

CREATE TABLE IF NOT EXISTS "public"."financial_records" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "business_id" uuid,
    "record_date" date,
    "amount" numeric,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "financial_records_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "financial_records_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE CASCADE,
    CONSTRAINT "financial_records_business_id_record_date_key" UNIQUE ("business_id", "record_date")
);
