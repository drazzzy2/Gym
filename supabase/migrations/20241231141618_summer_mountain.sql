-- Drop the existing foreign key constraint
ALTER TABLE revenue_history
DROP CONSTRAINT IF EXISTS revenue_history_member_id_fkey;

-- Add the new foreign key constraint with ON DELETE CASCADE
ALTER TABLE revenue_history
ADD CONSTRAINT revenue_history_member_id_fkey
FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE;