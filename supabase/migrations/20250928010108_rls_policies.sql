-- RLS policies for Supabase tables

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can view their own profile'
	) THEN
		EXECUTE 'CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT TO authenticated USING ((auth.uid() = id))';
	END IF;
END $$;
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can update their own profile'
	) THEN
		EXECUTE 'CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING ((auth.uid() = id))';
	END IF;
END $$;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'Users can view their own roles'
	) THEN
		EXECUTE 'CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING (((user_id = auth.uid()) OR public.is_admin_or_hub_manager(auth.uid())))';
	END IF;
END $$;

ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'businesses' AND policyname = 'Users can view their own businesses'
	) THEN
		EXECUTE 'CREATE POLICY "Users can view their own businesses" ON public.businesses FOR SELECT TO authenticated USING (((user_id = auth.uid()) OR public.is_admin_or_hub_manager(auth.uid())))';
	END IF;
END $$;
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'businesses' AND policyname = 'Users can update their own businesses'
	) THEN
		EXECUTE 'CREATE POLICY "Users can update their own businesses" ON public.businesses FOR UPDATE TO authenticated USING (((user_id = auth.uid()) OR public.is_admin_or_hub_manager(auth.uid())))';
	END IF;
END $$;
