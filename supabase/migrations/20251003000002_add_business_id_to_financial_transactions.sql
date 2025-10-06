-- Add business_id to financial_transactions table
ALTER TABLE public.financial_transactions 
ADD COLUMN business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE;

-- Add a comment to document the change
COMMENT ON COLUMN public.financial_transactions.business_id IS 'References the business/strategy this transaction belongs to';

-- Create an index for better query performance
CREATE INDEX IF NOT EXISTS idx_financial_transactions_business_id 
ON public.financial_transactions(business_id);

-- Update existing transactions to associate them with the first business of the user
-- This is a best-effort approach - you might need to manually review these assignments
DO $$
DECLARE
    user_record RECORD;
    first_business_id UUID;
BEGIN
    -- For each user with transactions
    FOR user_record IN SELECT DISTINCT user_id FROM public.financial_transactions WHERE user_id IS NOT NULL
    LOOP
        -- Get the user's first business
        SELECT id INTO first_business_id 
        FROM public.businesses 
        WHERE user_id = user_record.user_id 
        ORDER BY created_at 
        LIMIT 1;
        
        -- If the user has a business, update their transactions
        IF first_business_id IS NOT NULL THEN
            UPDATE public.financial_transactions
            SET business_id = first_business_id
            WHERE user_id = user_record.user_id;
        END IF;
    END LOOP;
END $$;

-- Make the business_id required after populating existing data
-- First, drop the existing constraint if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE table_name = 'financial_transactions' 
        AND constraint_name = 'financial_transactions_business_id_not_null'
    ) THEN
        ALTER TABLE public.financial_transactions 
        DROP CONSTRAINT financial_transactions_business_id_not_null;
    END IF;
END $$;

-- Add a check constraint to ensure business_id is not null for new records
ALTER TABLE public.financial_transactions 
ALTER COLUMN business_id SET NOT NULL;

-- Update RLS policies if they exist
DO $$
BEGIN
    -- Drop existing policy if it exists
    DROP POLICY IF EXISTS "Users can view their own transactions" ON public.financial_transactions;
    
    -- Create new policy that checks both user_id and business_id
    CREATE POLICY "Users can view their own transactions" 
    ON public.financial_transactions
    FOR SELECT
    USING (
        auth.uid() = user_id
        AND (
            -- Either the user is an admin
            EXISTS (
                SELECT 1 FROM public.user_roles 
                WHERE user_id = auth.uid() 
                AND role = 'admin'
            )
            -- Or the transaction belongs to one of their businesses
            OR business_id IN (
                SELECT id FROM public.businesses 
                WHERE user_id = auth.uid()
            )
        )
    );
    
    -- Drop existing insert policy if it exists
    DROP POLICY IF EXISTS "Users can insert their own transactions" ON public.financial_transactions;
    
    -- Create new insert policy
    CREATE POLICY "Users can insert their own transactions" 
    ON public.financial_transactions
    FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND business_id IN (
            SELECT id FROM public.businesses 
            WHERE user_id = auth.uid()
        )
    );
    
    -- Drop existing update policy if it exists
    DROP POLICY IF EXISTS "Users can update their own transactions" ON public.financial_transactions;
    
    -- Create new update policy
    CREATE POLICY "Users can update their own transactions" 
    ON public.financial_transactions
    FOR UPDATE
    USING (
        auth.uid() = user_id
        AND business_id IN (
            SELECT id FROM public.businesses 
            WHERE user_id = auth.uid()
        )
    )
    WITH CHECK (
        auth.uid() = user_id
        AND business_id IN (
            SELECT id FROM public.businesses 
            WHERE user_id = auth.uid()
        )
    );
    
    -- Drop existing delete policy if it exists
    DROP POLICY IF EXISTS "Users can delete their own transactions" ON public.financial_transactions;
    
    -- Create new delete policy
    CREATE POLICY "Users can delete their own transactions" 
    ON public.financial_transactions
    FOR DELETE
    USING (
        auth.uid() = user_id
        AND business_id IN (
            SELECT id FROM public.businesses 
            WHERE user_id = auth.uid()
        )
    );
    
    -- Grant necessary permissions
    GRANT SELECT, INSERT, UPDATE, DELETE ON public.financial_transactions TO authenticated;
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error updating RLS policies: %', SQLERRM;
END $$;
