/*
  # Gym Members Management Schema

  1. New Tables
    - `subscriptions`
      - `id` (uuid, primary key)
      - `name` (text) - Name of the subscription plan
      - `price` (numeric) - Monthly price
      - `description` (text) - Plan description
      - `duration_months` (int) - Duration in months
      - `created_at` (timestamp)

    - `members`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - References auth.users
      - `subscription_id` (uuid) - References subscriptions
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text)
      - `phone` (text)
      - `start_date` (date)
      - `end_date` (date)
      - `status` (text) - active/inactive/expired
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create subscriptions table
CREATE TABLE subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    price numeric NOT NULL CHECK (price >= 0),
    description text,
    duration_months integer NOT NULL CHECK (duration_months > 0),
    created_at timestamptz DEFAULT now(),
    UNIQUE(name)
);

-- Create members table
CREATE TABLE members (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id),
    subscription_id uuid REFERENCES subscriptions(id),
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL UNIQUE,
    phone text,
    start_date date NOT NULL DEFAULT CURRENT_DATE,
    end_date date NOT NULL,
    status text NOT NULL CHECK (status IN ('active', 'inactive', 'expired')) DEFAULT 'active',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT valid_dates CHECK (end_date >= start_date)
);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Policies for subscriptions
CREATE POLICY "Subscriptions are viewable by authenticated users"
ON subscriptions FOR SELECT
TO authenticated
USING (true);

-- Policies for members
CREATE POLICY "Members are viewable by authenticated users"
ON members FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Members can be inserted by authenticated users"
ON members FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Members can be updated by authenticated users"
ON members FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Insert some default subscription plans
INSERT INTO subscriptions (name, price, description, duration_months) VALUES
('Monthly Basic', 29.99, 'Basic gym access with standard equipment', 1),
('Monthly Premium', 49.99, 'Full access including classes and pool', 1),
('Quarterly Basic', 79.99, 'Basic gym access with standard equipment', 3),
('Quarterly Premium', 129.99, 'Full access including classes and pool', 3),
('Annual Basic', 299.99, 'Basic gym access with standard equipment', 12),
('Annual Premium', 499.99, 'Full access including classes and pool', 12);