-- Migration: Update RLS policies to consistently use strategies.business_id ownership checks where relevant
-- Generated: 2025-10-05

DO $$
BEGIN
  -- Businesses table: ensure policies allow access if user owns the business or owns a strategy referencing the business
  DROP POLICY IF EXISTS "Users can view their own businesses" ON public.businesses;
  DROP POLICY IF EXISTS "Users can manage their own businesses" ON public.businesses;

  -- Create business policies only if businesses table exists (it does) and strategies.business_id exists
  CREATE POLICY "Users can view their own businesses"
  ON public.businesses
  FOR SELECT
  USING (
    auth.uid() = user_id OR
    (
      EXISTS (
        SELECT 1 FROM information_schema.columns c WHERE c.table_schema = 'public' AND c.table_name = 'strategies' AND c.column_name = 'business_id'
      ) AND EXISTS (
        SELECT 1 FROM public.strategies s WHERE s.business_id = businesses.id AND s.user_id = auth.uid()
      )
    ) OR public.is_admin_or_hub_manager(auth.uid())
  );

  CREATE POLICY "Users can manage their own businesses"
  ON public.businesses
  FOR ALL
  USING (
    auth.uid() = user_id OR
    (
      EXISTS (
        SELECT 1 FROM information_schema.columns c WHERE c.table_schema = 'public' AND c.table_name = 'strategies' AND c.column_name = 'business_id'
      ) AND EXISTS (
        SELECT 1 FROM public.strategies s WHERE s.business_id = businesses.id AND s.user_id = auth.uid()
      )
    ) OR public.is_admin_or_hub_manager(auth.uid())
  )
  WITH CHECK (
    auth.uid() = user_id OR
    (
      EXISTS (
        SELECT 1 FROM information_schema.columns c WHERE c.table_schema = 'public' AND c.table_name = 'strategies' AND c.column_name = 'business_id'
      ) AND EXISTS (
        SELECT 1 FROM public.strategies s WHERE s.business_id = businesses.id AND s.user_id = auth.uid()
      )
    ) OR public.is_admin_or_hub_manager(auth.uid())
  );

  -- Financial records: allow access if user owns the strategy that the record references or owns the business
  DROP POLICY IF EXISTS "Users can manage financial records for their businesses" ON public.financial_records;
  DROP POLICY IF EXISTS "Users can manage financial records for their businesses or hub businesses" ON public.financial_records;

  -- Financial records policy: only reference strategy_id if the column exists
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'financial_records' AND column_name = 'strategy_id') THEN
    CREATE POLICY "Users can manage financial records for their businesses"
    ON public.financial_records
    FOR ALL
    USING (
      auth.uid() = (SELECT user_id FROM public.strategies WHERE id = financial_records.strategy_id)
      OR EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = financial_records.business_id AND (b.user_id = auth.uid() OR public.is_admin_or_hub_manager(auth.uid())))
    )
    WITH CHECK (
      auth.uid() = (SELECT user_id FROM public.strategies WHERE id = financial_records.strategy_id)
      OR EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = financial_records.business_id AND (b.user_id = auth.uid() OR public.is_admin_or_hub_manager(auth.uid())))
    );
  ELSE
    -- Fallback: keep existing business-based checks
    CREATE POLICY "Users can manage financial records for their businesses"
    ON public.financial_records
    FOR ALL
    USING (
      EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = financial_records.business_id AND (b.user_id = auth.uid() OR public.is_admin_or_hub_manager(auth.uid())))
    )
    WITH CHECK (
      EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = financial_records.business_id AND (b.user_id = auth.uid() OR public.is_admin_or_hub_manager(auth.uid())))
    );
  END IF;

  -- Business milestones: ensure ownership checks use strategies when appropriate
  DROP POLICY IF EXISTS "Users can view their own milestones" ON public.business_milestones;
  DROP POLICY IF EXISTS "Users can manage their own milestones" ON public.business_milestones;

  -- Milestones: create policies guarded by strategy_id existence
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'business_milestones' AND column_name = 'strategy_id') THEN
    CREATE POLICY "Users can view their own milestones"
    ON public.business_milestones
    FOR SELECT
    USING (
      EXISTS (SELECT 1 FROM public.strategies s WHERE s.id = business_milestones.strategy_id AND s.user_id = auth.uid()) OR
      EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_milestones.business_id AND b.user_id = auth.uid())
    );
  ELSE
    CREATE POLICY "Users can view their own milestones"
    ON public.business_milestones
    FOR SELECT
    USING (
      EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_milestones.business_id AND b.user_id = auth.uid())
    );
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'business_milestones' AND column_name = 'strategy_id') THEN
    CREATE POLICY "Users can manage their own milestones"
    ON public.business_milestones
    FOR ALL
    USING (
      EXISTS (SELECT 1 FROM public.strategies s WHERE s.id = business_milestones.strategy_id AND s.user_id = auth.uid()) OR
      EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_milestones.business_id AND b.user_id = auth.uid())
    )
    WITH CHECK (
      EXISTS (SELECT 1 FROM public.strategies s WHERE s.id = business_milestones.strategy_id AND s.user_id = auth.uid()) OR
      EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_milestones.business_id AND b.user_id = auth.uid())
    );
  ELSE
    CREATE POLICY "Users can manage their own milestones"
    ON public.business_milestones
    FOR ALL
    USING (
      EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_milestones.business_id AND b.user_id = auth.uid())
    )
    WITH CHECK (
      EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_milestones.business_id AND b.user_id = auth.uid())
    );
  END IF;

  -- Financial transactions policies (if table exists)
  -- Financial transactions: create policies only if table exists and refer to strategy_id when present
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'financial_transactions') THEN
    DROP POLICY IF EXISTS "Users can view their own transactions" ON public.financial_transactions;
    DROP POLICY IF EXISTS "Users can insert their own transactions" ON public.financial_transactions;
    DROP POLICY IF EXISTS "Users can update their own transactions" ON public.financial_transactions;
    DROP POLICY IF EXISTS "Users can delete their own transactions" ON public.financial_transactions;

    -- Check which columns exist and create policies accordingly
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'financial_transactions' AND column_name = 'strategy_id') THEN
      -- strategy_id exists
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'financial_transactions' AND column_name = 'business_id') THEN
        -- both strategy_id and business_id exist
        CREATE POLICY "Users can view their own transactions"
        ON public.financial_transactions
        FOR SELECT
        USING (
          auth.uid() = (SELECT user_id FROM public.strategies WHERE id = financial_transactions.strategy_id)
          OR EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = financial_transactions.business_id AND b.user_id = auth.uid())
        );

        CREATE POLICY "Users can insert their own transactions"
        ON public.financial_transactions
        FOR INSERT
        WITH CHECK (
          auth.uid() = (SELECT user_id FROM public.strategies WHERE id = strategy_id)
          OR EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.user_id = auth.uid())
        );

        CREATE POLICY "Users can update their own transactions"
        ON public.financial_transactions
        FOR UPDATE
        USING (
          auth.uid() = (SELECT user_id FROM public.strategies WHERE id = financial_transactions.strategy_id)
          OR EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = financial_transactions.business_id AND b.user_id = auth.uid())
        )
        WITH CHECK (
          auth.uid() = (SELECT user_id FROM public.strategies WHERE id = strategy_id)
          OR EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.user_id = auth.uid())
        );

        CREATE POLICY "Users can delete their own transactions"
        ON public.financial_transactions
        FOR DELETE
        USING (
          auth.uid() = (SELECT user_id FROM public.strategies WHERE id = financial_transactions.strategy_id)
          OR EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = financial_transactions.business_id AND b.user_id = auth.uid())
        );
      ELSE
        -- only strategy_id exists
        CREATE POLICY "Users can view their own transactions"
        ON public.financial_transactions
        FOR SELECT
        USING (
          auth.uid() = (SELECT user_id FROM public.strategies WHERE id = financial_transactions.strategy_id)
        );

        CREATE POLICY "Users can insert their own transactions"
        ON public.financial_transactions
        FOR INSERT
        WITH CHECK (
          auth.uid() = (SELECT user_id FROM public.strategies WHERE id = strategy_id)
        );

        CREATE POLICY "Users can update their own transactions"
        ON public.financial_transactions
        FOR UPDATE
        USING (
          auth.uid() = (SELECT user_id FROM public.strategies WHERE id = financial_transactions.strategy_id)
        )
        WITH CHECK (
          auth.uid() = (SELECT user_id FROM public.strategies WHERE id = strategy_id)
        );

        CREATE POLICY "Users can delete their own transactions"
        ON public.financial_transactions
        FOR DELETE
        USING (
          auth.uid() = (SELECT user_id FROM public.strategies WHERE id = financial_transactions.strategy_id)
        );
      END IF;
    ELSE
      -- strategy_id doesn't exist
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'financial_transactions' AND column_name = 'business_id') THEN
        -- only business_id exists
        CREATE POLICY "Users can view their own transactions"
        ON public.financial_transactions
        FOR SELECT
        USING (
          EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = financial_transactions.business_id AND b.user_id = auth.uid())
        );

        CREATE POLICY "Users can insert their own transactions"
        ON public.financial_transactions
        FOR INSERT
        WITH CHECK (
          EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.user_id = auth.uid())
        );

        CREATE POLICY "Users can update their own transactions"
        ON public.financial_transactions
        FOR UPDATE
        USING (
          EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = financial_transactions.business_id AND b.user_id = auth.uid())
        )
        WITH CHECK (
          EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.user_id = auth.uid())
        );

        CREATE POLICY "Users can delete their own transactions"
        ON public.financial_transactions
        FOR DELETE
        USING (
          EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = financial_transactions.business_id AND b.user_id = auth.uid())
        );
      ELSE
        -- Neither strategy_id nor business_id exist; create conservative policies (admins only)
        CREATE POLICY "Users can view their own transactions"
        ON public.financial_transactions
        FOR SELECT
        USING (public.is_admin_or_hub_manager(auth.uid()));

        CREATE POLICY "Users can insert their own transactions"
        ON public.financial_transactions
        FOR INSERT
        WITH CHECK (public.is_admin_or_hub_manager(auth.uid()));

        CREATE POLICY "Users can update their own transactions"
        ON public.financial_transactions
        FOR UPDATE
        USING (public.is_admin_or_hub_manager(auth.uid()))
        WITH CHECK (public.is_admin_or_hub_manager(auth.uid()));

        CREATE POLICY "Users can delete their own transactions"
        ON public.financial_transactions
        FOR DELETE
        USING (public.is_admin_or_hub_manager(auth.uid()));
      END IF;
    END IF;
  END IF;

END $$;
