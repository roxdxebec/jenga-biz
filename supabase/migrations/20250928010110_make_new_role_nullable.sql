-- Make new_role nullable in role_change_audit for any removal of role
ALTER TABLE role_change_audit
ALTER COLUMN new_role DROP NOT NULL;
