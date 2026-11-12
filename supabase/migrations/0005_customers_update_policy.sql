-- 0005: Add missing RLS policies for customers table updates
-- Run after 0004_customer_signup_trigger.sql

-- Allow authenticated users to update their own customer record
DROP POLICY IF EXISTS "customers_update_own" ON customers;
CREATE POLICY "customers_update_own" ON customers
  FOR UPDATE USING (auth.uid() = id);

-- Allow authenticated users to insert their own customer record (fallback if trigger fails)
DROP POLICY IF EXISTS "customers_insert_own" ON customers;
CREATE POLICY "customers_insert_own" ON customers
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Ensure service role has full access
GRANT ALL ON customers TO service_role;
GRANT SELECT, UPDATE ON customers TO authenticated;
