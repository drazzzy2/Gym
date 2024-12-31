-- Create revenue_history table
CREATE TABLE IF NOT EXISTS revenue_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  member_id uuid REFERENCES members(id) ON DELETE CASCADE,
  subscription_id uuid REFERENCES subscriptions(id),
  amount numeric NOT NULL CHECK (amount >= 0),
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE revenue_history ENABLE ROW LEVEL SECURITY;

-- Policies for revenue_history
CREATE POLICY "Users can view their own revenue history"
ON revenue_history FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own revenue history"
ON revenue_history FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Function to create revenue history entry
CREATE OR REPLACE FUNCTION create_revenue_history()
RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'active' AND (OLD.status IS NULL OR OLD.status != 'active') THEN
    INSERT INTO revenue_history (
      user_id,
      member_id,
      subscription_id,
      amount,
      date
    )
    SELECT
      NEW.user_id,
      NEW.id,
      NEW.subscription_id,
      s.price,
      CURRENT_DATE
    FROM subscriptions s
    WHERE s.id = NEW.subscription_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for revenue history
CREATE TRIGGER create_revenue_history_trigger
  AFTER INSERT OR UPDATE OF status
  ON members
  FOR EACH ROW
  EXECUTE FUNCTION create_revenue_history();