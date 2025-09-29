

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename = 'subscription_plans'
      AND indexname = 'uq_subscription_plans_lower_name'
  ) THEN
    EXECUTE 'CREATE UNIQUE INDEX uq_subscription_plans_lower_name ON public.subscription_plans (lower(name))';
  END IF;
END $$;

-- Free plan
insert into public.subscription_plans (name, description, price, currency, billing_cycle, features, is_active)
values (
  'Free',
  'Basic access suitable for getting started.',
  0.00,
  'KES',
  'monthly',
  '{
    "tier": "free",
    "limits": {"businesses": 1, "storage_mb": 50},
    "features": {
      "dashboard": true,
      "transactions": true,
      "reports_basic": true,
      "templates_all": true,
      "ocr": false
    }
  }'::jsonb,
  true
)
on conflict (lower(name)) do nothing;

-- Pro plan
insert into public.subscription_plans (name, description, price, currency, billing_cycle, features, is_active)
values (
  'Pro',
  'Enhanced capabilities for growing businesses.',
  1.00,
  'KES',
  'monthly',
  '{
    "tier": "pro",
    "limits": {"businesses": 3, "storage_mb": 1024},
    "features": {
      "dashboard": true,
      "transactions": true,
      "reports_advanced": true,
      "templates_all": true,
      "ocr": true
    }
  }'::jsonb,
  true
)
on conflict (lower(name)) do nothing;

-- Premium plan
insert into public.subscription_plans (name, description, price, currency, billing_cycle, features, is_active)
values (
  'Premium',
  'Full feature set, recommended for hub-invited entrepreneurs.',
  1.00,
  'KES',
  'monthly',
  '{
    "tier": "premium",
    "limits": {"businesses": 10, "storage_mb": 5120},
    "features": {
      "dashboard": true,
      "transactions": true,
      "reports_advanced": true,
      "templates_all": true,
      "ocr": true,
      "priority_support": true
    }
  }'::jsonb,
  true
)
on conflict (lower(name)) do nothing;
