Cleanup runbook — legacy tables

Overview

This runbook guides a safe cleanup of legacy database tables in the Supabase/Postgres database used by Jenga Biz. It creates backups, verifies them, and then performs controlled destructive drops. Apply these in a staging environment first.

Files created in this repo

- supabase/migrations/20251005120000_backup_legacy_tables.sql — creates `backups.*_backup` snapshot tables for legacy tables.
- supabase/migrations/20251005121000_drop_legacy_tables.sql — drops legacy tables (wrapped in existence checks).

Pre-conditions

1. Ensure you have access to the Supabase project defined in `supabase/config.toml`.
2. Run this in a staging environment first.
3. Ensure you have a full project backup (pg_dump) if you require full DDL+data fidelity.

Steps

1) Review the migration files locally. Ensure they match your intended cleanup.

2) Apply the backup migration first:

   Use the Supabase CLI or SQL runner to apply the migration. Example (supabase CLI):

   supabase db remote set <your-connection> ; supabase db push --file supabase/migrations/20251005120000_backup_legacy_tables.sql

   Or via psql (replace placeholders):

   psql "postgresql://<user>:<pass>@<host>:<port>/<db>" -f supabase/migrations/20251005120000_backup_legacy_tables.sql

3) Verify backups:

   - Query backups.business_milestones_backup and backups.financial_transactions_backup to confirm row counts and a sample of rows.
   - Example queries via psql:

     SELECT count(*) FROM backups.business_milestones_backup;
     SELECT count(*) FROM backups.financial_transactions_backup LIMIT 10;

4) If backups look good, apply the drop migration:

   psql "postgresql://<user>:<pass>@<host>:<port>/<db>" -f supabase/migrations/20251005121000_drop_legacy_tables.sql

5) Smoke tests

   - Create a test transaction associated with a strategy and verify `financial_records` is updated (if you have a trigger/function in place).
   - Visit the dashboards and ensure aggregates update.
   - Run a small integration test (if you have a staging test suite).

6) Rollback plan

   If anything goes wrong, you can restore from backups.business_milestones_backup and backups.financial_transactions_backup by copying rows back into the original tables (or restore from pg_dump snapshot).

   Example restore (psql):
     -- recreate original table if needed using a saved DDL
     INSERT INTO public.business_milestones SELECT * FROM backups.business_milestones_backup;

Notes & warnings

- financial_transactions is considered the canonical transaction history. Do NOT drop it unless you have intentionally migrated all required logic to another table and have backups.
- The drop migration intentionally targets tables named `business_milestones` and `financial_records_legacy`. Adjust the migration if your legacy table names differ.
- If you need precise DDL clones (indexes, FKs, constraints), use `pg_dump --schema-only` and `pg_dump --data-only` to capture both.

If you want, I can:
- Apply the backup SQL to the Supabase project configured in `supabase/config.toml` and report the row counts.
- Apply the drop migration in staging after your approval.
- Create an extra migration that renames the old tables (safer) instead of dropping them.
