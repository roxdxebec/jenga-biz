-- Add strategy_id, registration_number, and registration_certificate_url to businesses table
ALTER TABLE public.businesses 
ADD COLUMN IF NOT EXISTS strategy_id UUID REFERENCES public.strategies(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS registration_number TEXT,
ADD COLUMN IF NOT EXISTS registration_certificate_url TEXT,
ADD COLUMN IF NOT EXISTS business_type TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Create index for strategy_id
CREATE INDEX IF NOT EXISTS idx_businesses_strategy_id ON public.businesses(strategy_id);

-- Update RLS policies if they exist
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Users can view their own businesses" ON public.businesses;
    DROP POLICY IF EXISTS "Users can manage their own businesses" ON public.businesses;
    
    -- Create new policies that include strategy_id check
    CREATE POLICY "Users can view their own businesses" 
    ON public.businesses
    FOR SELECT
    USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM public.strategies s 
            WHERE s.id = businesses.strategy_id AND s.user_id = auth.uid()
        )
    );
    
    CREATE POLICY "Users can manage their own businesses"
    ON public.businesses
    FOR ALL
    USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM public.strategies s 
            WHERE s.id = businesses.strategy_id AND s.user_id = auth.uid()
        )
    )
    WITH CHECK (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM public.strategies s 
            WHERE s.id = businesses.strategy_id AND s.user_id = auth.uid()
        )
    );
END $$;

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_trigger 
        WHERE tgname = 'update_businesses_updated_at'
    ) THEN
        CREATE TRIGGER update_businesses_updated_at
        BEFORE UPDATE ON public.businesses
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;
