## Migration runbook — migrate legacy tables to canonical schema

This runbook describes the safe sequence to migrate legacy tables (`business_milestones`, `financial_records`) to canonical tables (`milestones`, `financial_transactions`), verify, and remove legacy tables in staging/production.

High-level sequence
- Apply conservative migration to copy legacy data into canonical tables (non-destructive).
- Verify data integrity and UI behavior in staging.
- Regenerate DB types and run full test-suite / smoke checks.
- Create backups (export or rely on SQL-generated backup tables) and confirm backups are accessible.
- Run destructive migration (backup + drop legacy tables) in production during low-traffic window.
- Post-migration verification and monitoring.

Pre-flight checklist
- Ensure you have proper permissions to run migrations and create backups on the target project.
- Identify the target Supabase project ID (project_ref) and confirm you are operating on the correct environment (staging vs production).
- Take an export / snapshot of the DB if possible (pg_dump or Supabase console backup).
- Communicate maintenance window to stakeholders if needed.
- Ensure CI/test runner and the deployment pipeline are ready to run smoke tests.

Step-by-step

1) Run conservative migration (non-destructive)

- File: `supabase/migrations/20251006120000_migrate_legacy_financials_and_milestones.sql`
- Why: copies rows from `business_milestones` -> `milestones` and `financial_records` -> `financial_transactions`, adds missing columns (e.g., `completed_at`), and optionally drops legacy tables only if they are empty.
- How: `supabase db push` or run the SQL via the Supabase SQL interface/CLI in staging. Confirm the migration applies without errors.

2) Verify canonical tables in staging

- Run counts and sample queries against `milestones` and `financial_transactions`.
- Verify that all expected rows have migrated and that important columns (`strategy_id`, `milestone_type`, `completed_at`, `transaction_date`, `transaction_type`) are present and populated as expected.
- Manually test UI flows that display milestones and financial transactions (create/update/delete flows).

3) Regenerate TypeScript types and update code

- Regenerate `src/integrations/supabase/types.ts` using your preferred generator (supabase CLI generator or custom tool) against the staging DB.
- Run `npx tsc --noEmit` and your unit/integration tests. Fix any type or runtime issues.

4) Backup production data (required)

- Before any destructive action, take a full logical backup (pg_dump) or use the Supabase snapshot/backup facilities if available.
- Optionally, the destructive migration also creates SQL backups as timestamped tables (see `20251006124500_drop_legacy_business_tables.sql`) — but an external backup is recommended.

5) Run destructive migration (backup + drop)

- File: `supabase/migrations/20251006124500_drop_legacy_business_tables.sql`
- Why: creates timestamped backup tables and drops legacy `business_milestones` and `financial_records` if present.
- When: run only after step (2)/(3) verified on staging and after backups are taken in production.

6) Post-migration verification

- Re-run queries to ensure `business_milestones` and `financial_records` no longer exist (or are backed up as `*_backup_<ts>` tables).
- Verify UI for milestones and financials in production.
- Monitor error logs and request user verification for critical flows.

Rollback guidance
- If something is wrong after the destructive drop and you need to restore legacy tables, restore from the external backup you took before running destructive migration (pg_restore) or use the timestamped backup tables created by the migration (they contain full table data). Example:

  -- Restore using SQL copy from backup table (example)
  CREATE TABLE public.financial_records AS TABLE public.financial_records_backup_YYYYMMDD_HH24MISS WITH DATA;

- If the canonical tables are missing data, you can reverse-copy from the backup tables into canonical tables.

Notes & cautions
- The provided SQL migrations are idempotent and check for table existence before performing destructive actions, but environment schemas can differ — always run in staging first.
- RLS policies referencing legacy tables (if present) may need manual updates or removal — review `supabase/migrations/*rls*` for references.
- If you want me to run these migrations against a different Supabase project, provide the target `project_id` (project_ref) and confirm you want me to proceed. I will run the SQL and provide verification output.

Contact
- If you want I can also generate a one-click checklist or a small script to run the verification queries and produce a short report after migration.
