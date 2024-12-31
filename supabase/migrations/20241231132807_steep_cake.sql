/*
  # Add delete policy for members table

  1. Changes
    - Add RLS policy to allow users to delete their own members
*/

CREATE POLICY "Members can be deleted by authenticated users"
ON members FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);