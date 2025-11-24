-- Script to create default admin user
-- Run this in your Supabase SQL editor

-- Create default admin user with email: admin@concours.com and password: admin (5 characters)
DO $$
DECLARE
    user_id UUID;
BEGIN
    -- Insert or update the user
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
        '{"provider": "email", "providers": ["email"]}',
        '{}',
        FALSE
    )
    ON CONFLICT (email) DO UPDATE SET
        encrypted_password = crypt('admin', gen_salt('bf')),
        email_confirmed_at = NOW()
    RETURNING id INTO user_id;

    -- If no user_id returned (user already exists), get the existing user_id
    IF user_id IS NULL THEN
        SELECT id INTO user_id FROM auth.users WHERE email = 'admin@concours.com';
    END IF;

    -- Create or update admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;

    RAISE NOTICE 'Default admin user created/updated successfully';
END $$;