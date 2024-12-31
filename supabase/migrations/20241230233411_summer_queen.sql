/*
  # Add check-ins and unique member IDs

  1. Changes to Members Table
    - Add unique_id column with auto-generated values
    - Add trigger to generate unique_id on insert

  2. New Tables
    - `check_ins`
      - `id` (uuid, primary key)
      - `member_id` (uuid, foreign key to members)
      - `check_in_time` (timestamptz)
      - `check_out_time` (timestamptz, nullable)
      - `created_at` (timestamptz)

  3. Security
    - Enable RLS on check_ins table
    - Add policies for authenticated users to:
      - View check-ins for their members
      - Create new check-ins
      - Update check-outs
*/

-- Add unique_id to members
ALTER TABLE members 
ADD COLUMN IF NOT EXISTS unique_id text UNIQUE;

-- Create function to generate unique member IDs
CREATE OR REPLACE FUNCTION generate_unique_member_id()
RETURNS trigger AS $$
BEGIN
  NEW.unique_id := 'M-' || LPAD(nextval('member_id_seq')::text, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for member IDs if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'member_id_seq') THEN
    CREATE SEQUENCE member_id_seq START 1;
  END IF;
END $$;

-- Create trigger for auto-generating unique_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'set_unique_member_id' 
    AND tgrelid = 'members'::regclass
  ) THEN
    CREATE TRIGGER set_unique_member_id
      BEFORE INSERT ON members
      FOR EACH ROW
      EXECUTE FUNCTION generate_unique_member_id();
  END IF;
END $$;

-- Update existing members with unique IDs if they don't have one
DO $$
DECLARE
  m RECORD;
  next_id INTEGER;
BEGIN
  FOR m IN SELECT id FROM members WHERE unique_id IS NULL LOOP
    next_id := nextval('member_id_seq');
    UPDATE members 
    SET unique_id = 'M-' || LPAD(next_id::text, 6, '0')
    WHERE id = m.id;
  END LOOP;
END $$;

-- Create check_ins table
CREATE TABLE IF NOT EXISTS check_ins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid REFERENCES members(id) ON DELETE CASCADE,
  check_in_time timestamptz NOT NULL DEFAULT now(),
  check_out_time timestamptz,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_checkout_time CHECK (check_out_time IS NULL OR check_out_time >= check_in_time)
);

-- Enable RLS
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;

-- Policies for check_ins
CREATE POLICY "Users can view their members' check-ins"
ON check_ins FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM members
    WHERE members.id = check_ins.member_id
    AND members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create check-ins for their members"
ON check_ins FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM members
    WHERE members.id = member_id
    AND members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update check-outs for their members"
ON check_ins FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM members
    WHERE members.id = check_ins.member_id
    AND members.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM members
    WHERE members.id = check_ins.member_id
    AND members.user_id = auth.uid()
  )
);