-- Fix RLS policies for user_roles table to allow admin registration
-- Run this SQL directly in your Supabase SQL editor

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

-- Create separate policies for different operations
CREATE POLICY "Admins can update roles"
  ON public.user_roles
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
  ON public.user_roles
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can create admin role"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (role = 'admin');

-- Verify the policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'user_roles';