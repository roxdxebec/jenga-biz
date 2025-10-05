-- Migration: 20251005120000_backup_legacy_tables.sql
-- Purpose: Create snapshot backups of legacy tables before any destructive cleanup.
-- IMPORTANT: This migration will copy data into a safe `backups` schema. Review before applying.

BEGIN;

-- Create a backups schema to hold snapshots
CREATE SCHEMA IF NOT EXISTS backups;

-- Snapshot business_milestones
DROP TABLE IF EXISTS backups.business_milestones_backup CASCADE;
CREATE TABLE backups.business_milestones_backup AS
SELECT * FROM public.business_milestones;

-- Snapshot financial_transactions
DROP TABLE IF EXISTS backups.financial_transactions_backup CASCADE;
CREATE TABLE backups.financial_transactions_backup AS
SELECT * FROM public.financial_transactions;

-- Snapshot any other legacy artifacts you want preserved (examples below)
-- DROP TABLE IF EXISTS backups.business_milestones_types_backup CASCADE;
-- CREATE TABLE backups.business_milestones_types_backup AS SELECT * FROM public.business_milestones_types;

COMMIT;

-- Notes:
-- 1) These backup tables are plain copies of the data at the time the migration runs.
-- 2) They do not preserve foreign keys, indexes or constraints. If you need exact DDL clones (with FK/indexes), perform a pg_dump of the schema + data instead.
-- 3) Keep these backups for at least one deployment cycle before removing them.
