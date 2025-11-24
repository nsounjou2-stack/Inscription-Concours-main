-- Simple admin setup - Run this in Supabase SQL Editor
-- This creates admin@concours.com with password 'admin'

-- Delete existing user if exists
DELETE FROM public.user_roles WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'admin@concours.com');
DELETE FROM auth.users WHERE email = 'admin@concours.com';

-- Create admin user with proper password hashing
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@concours.com',
  crypt('admin', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  false
);

-- Get the user ID and create admin role
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE email = 'admin@concours.com'
ON CONFLICT (user_id, role) DO NOTHING;