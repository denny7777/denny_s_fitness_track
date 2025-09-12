-- Location: supabase/migrations/20250101210010_fitness_tracking_app.sql
-- Schema Analysis: Fresh project - no existing schema
-- Integration Type: Complete fitness tracking system with authentication
-- Dependencies: None - fresh implementation

-- 1. Custom Types
CREATE TYPE public.goal_type AS ENUM ('weight_loss', 'muscle_gain', 'endurance', 'strength', 'flexibility');
CREATE TYPE public.goal_status AS ENUM ('active', 'completed', 'paused', 'archived');
CREATE TYPE public.check_in_mood AS ENUM ('excellent', 'good', 'neutral', 'tired', 'struggling');

-- 2. Core User Table (Critical intermediary for PostgREST compatibility)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Goals Management Tables
CREATE TABLE public.fitness_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    goal_type public.goal_type NOT NULL,
    target_value DECIMAL(10,2) NOT NULL,
    current_value DECIMAL(10,2) DEFAULT 0,
    unit TEXT NOT NULL,
    target_date DATE NOT NULL,
    status public.goal_status DEFAULT 'active'::public.goal_status,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Daily Check-ins Table
CREATE TABLE public.daily_check_ins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    mood public.check_in_mood NOT NULL,
    energy_level INTEGER NOT NULL CHECK (energy_level >= 1 AND energy_level <= 10),
    workout_completed BOOLEAN DEFAULT false,
    workout_summary TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date)
);

-- 5. Goal Progress Updates Table
CREATE TABLE public.goal_progress_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID REFERENCES public.fitness_goals(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    previous_value DECIMAL(10,2) NOT NULL,
    new_value DECIMAL(10,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_fitness_goals_user_id ON public.fitness_goals(user_id);
CREATE INDEX idx_fitness_goals_status ON public.fitness_goals(status);
CREATE INDEX idx_fitness_goals_target_date ON public.fitness_goals(target_date);
CREATE INDEX idx_daily_check_ins_user_id ON public.daily_check_ins(user_id);
CREATE INDEX idx_daily_check_ins_date ON public.daily_check_ins(date);
CREATE INDEX idx_goal_progress_updates_goal_id ON public.goal_progress_updates(goal_id);
CREATE INDEX idx_goal_progress_updates_user_id ON public.goal_progress_updates(user_id);

-- 7. Functions (Must be before RLS policies)
CREATE OR REPLACE FUNCTION public.update_goal_current_value()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Update goal current value when progress is updated
    UPDATE public.fitness_goals
    SET current_value = NEW.new_value,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.goal_id;
    
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)));
    RETURN NEW;
END;
$$;

-- 8. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fitness_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_progress_updates ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies (After functions are created)

-- Pattern 1: Core user table - Simple direct column comparison
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 2: Simple user ownership for fitness goals
CREATE POLICY "users_manage_own_fitness_goals"
ON public.fitness_goals
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Pattern 2: Simple user ownership for daily check-ins
CREATE POLICY "users_manage_own_daily_check_ins"
ON public.daily_check_ins
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Pattern 2: Simple user ownership for goal progress updates
CREATE POLICY "users_manage_own_goal_progress_updates"
ON public.goal_progress_updates
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 10. Triggers
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_goal_progress_update
    AFTER INSERT ON public.goal_progress_updates
    FOR EACH ROW EXECUTE FUNCTION public.update_goal_current_value();

-- 11. Mock Data with complete auth.users structure
DO $$
DECLARE
    admin_id UUID := gen_random_uuid();
    user_id UUID := gen_random_uuid();
    goal1_id UUID := gen_random_uuid();
    goal2_id UUID := gen_random_uuid();
    goal3_id UUID := gen_random_uuid();
BEGIN
    -- Create complete auth users (required for authentication to work)
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'demo@fitness.com', crypt('fitness123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Demo User"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'john@fitness.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "John Doe"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create fitness goals
    INSERT INTO public.fitness_goals (id, user_id, title, description, goal_type, target_value, current_value, unit, target_date) VALUES
        (goal1_id, admin_id, 'Lose 15 pounds', 'Get back to my ideal weight for summer', 'weight_loss', 15.00, 3.00, 'lbs', '2025-06-01'),
        (goal2_id, admin_id, 'Run 5K in under 25 minutes', 'Improve cardiovascular endurance for 5K race', 'endurance', 25.00, 28.00, 'minutes', '2025-04-15'),
        (goal3_id, user_id, 'Bench press 200 lbs', 'Increase upper body strength for bench press', 'strength', 200.00, 165.00, 'lbs', '2025-08-01');

    -- Create some daily check-ins
    INSERT INTO public.daily_check_ins (user_id, date, mood, energy_level, workout_completed, workout_summary, notes) VALUES
        (admin_id, CURRENT_DATE - INTERVAL '1 day', 'good', 8, true, 'Completed 30-minute cardio session and strength training. Focused on upper body exercises.', 'Feeling strong today. Good energy throughout the workout.'),
        (admin_id, CURRENT_DATE - INTERVAL '2 days', 'excellent', 9, true, 'Long run - 5 miles at steady pace. New personal best for endurance.', 'Amazing run today! Weather was perfect and I felt great the entire time.'),
        (user_id, CURRENT_DATE - INTERVAL '1 day', 'neutral', 6, false, 'Rest day - light stretching only', 'Taking a recovery day. Did some yoga and stretching.');

    -- Create progress updates
    INSERT INTO public.goal_progress_updates (goal_id, user_id, previous_value, new_value, notes) VALUES
        (goal1_id, admin_id, 0.00, 3.00, 'Great start! Lost 3 pounds in the first two weeks.'),
        (goal2_id, admin_id, 30.00, 28.00, 'Improved my 5K time by 2 minutes! Training is paying off.'),
        (goal3_id, user_id, 150.00, 165.00, 'Steady progress on bench press. Added 15 lbs this month.');

EXCEPTION
    WHEN unique_violation THEN
        RAISE NOTICE 'Mock data already exists, skipping insertion';
    WHEN OTHERS THEN
        RAISE NOTICE 'Error creating mock data: %', SQLERRM;
END $$;