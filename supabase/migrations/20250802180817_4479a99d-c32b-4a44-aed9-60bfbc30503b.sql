-- Fix the RLS policy for auth_users signup
DROP POLICY IF EXISTS "Allow public signup" ON public.auth_users;

CREATE POLICY "Allow public signup" ON public.auth_users
FOR INSERT 
WITH CHECK (true);