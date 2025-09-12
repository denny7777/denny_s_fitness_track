-- Fix authentication trigger and RLS policies for proper user signup

        -- First, ensure the trigger is properly set up for new user creation
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

        -- Create the trigger to automatically create user profiles
        CREATE OR REPLACE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW 
          EXECUTE FUNCTION public.handle_new_user();

        -- Update the handle_new_user function to be more robust
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS trigger
        LANGUAGE plpgsql
        SECURITY DEFINER
        SET search_path = public
        AS $$
        BEGIN
            -- Insert user profile with better error handling
            INSERT INTO public.user_profiles (id, email, full_name, created_at, updated_at)
            VALUES (
                NEW.id,
                NEW.email,
                COALESCE(
                    NEW.raw_user_meta_data->>'full_name',
                    split_part(NEW.email, '@', 1),
                    'User'
                ),
                NOW(),
                NOW()
            )
            ON CONFLICT (id) DO NOTHING;  -- Prevent duplicate insertion errors
            
            RETURN NEW;
        EXCEPTION
            WHEN others THEN
                -- Log error but don't fail the auth process
                RAISE WARNING 'Could not create user profile for %: %', NEW.id, SQLERRM;
                RETURN NEW;
        END;
        $$;

        -- Update RLS policies to allow profile creation during signup
        DROP POLICY IF EXISTS "users_manage_own_user_profiles" ON public.user_profiles;

        -- Create separate policies for different operations
        CREATE POLICY "users_can_insert_own_profile"
        ON public.user_profiles
        FOR INSERT
        TO authenticated
        WITH CHECK (id = auth.uid());

        CREATE POLICY "users_can_view_own_profile"
        ON public.user_profiles
        FOR SELECT
        TO authenticated
        USING (id = auth.uid());

        CREATE POLICY "users_can_update_own_profile"
        ON public.user_profiles
        FOR UPDATE
        TO authenticated
        USING (id = auth.uid())
        WITH CHECK (id = auth.uid());

        -- Allow service role to insert profiles (for the trigger)
        CREATE POLICY "service_can_insert_profiles"
        ON public.user_profiles
        FOR INSERT
        TO service_role
        WITH CHECK (true);

        -- Ensure RLS is enabled
        ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

        -- Create some test users with profiles if they don't exist
        DO $$
        DECLARE
            demo_user_id uuid;
            john_user_id uuid;
        BEGIN
            -- Check if demo users exist in auth.users, if not create them
            SELECT id INTO demo_user_id FROM auth.users WHERE email = 'demo@fitness.com';
            SELECT id INTO john_user_id FROM auth.users WHERE email = 'john@fitness.com';
            
            -- Create demo user profile if it doesn't exist
            IF demo_user_id IS NOT NULL THEN
                INSERT INTO public.user_profiles (id, email, full_name, created_at, updated_at)
                VALUES (demo_user_id, 'demo@fitness.com', 'Demo User', NOW(), NOW())
                ON CONFLICT (id) DO UPDATE SET
                    email = EXCLUDED.email,
                    full_name = EXCLUDED.full_name,
                    updated_at = NOW();
            END IF;
            
            -- Create john user profile if it doesn't exist
            IF john_user_id IS NOT NULL THEN
                INSERT INTO public.user_profiles (id, email, full_name, created_at, updated_at)
                VALUES (john_user_id, 'john@fitness.com', 'John Doe', NOW(), NOW())
                ON CONFLICT (id) DO UPDATE SET
                    email = EXCLUDED.email,
                    full_name = EXCLUDED.full_name,
                    updated_at = NOW();
            END IF;
        END $$;