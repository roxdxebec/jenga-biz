-- Create a function to handle strategy and business creation in a transaction
CREATE OR REPLACE FUNCTION public.create_strategy_with_business(
  p_strategy_data jsonb,
  p_business_data jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_business_id uuid;
  v_strategy_id uuid;
  v_result jsonb;
BEGIN
  -- Start transaction
  BEGIN
    -- Insert business
    INSERT INTO public.businesses (
      user_id,
      hub_id,
      name,
      business_type,
      stage,
      description,
      registration_number,
      registration_certificate_url,
      is_active
    ) VALUES (
      (p_business_data->>'user_id')::uuid,
      NULLIF(p_business_data->>'hub_id', '')::uuid,
      p_business_data->>'name',
      p_business_data->>'business_type',
      COALESCE((p_business_data->>'stage')::public.business_stage, 'idea'::public.business_stage),
      p_business_data->>'description',
      p_business_data->>'registration_number',
      p_business_data->>'registration_certificate_url',
      COALESCE((p_business_data->>'is_active')::boolean, true)
    )
    RETURNING id INTO v_business_id;

    -- Insert strategy with the new business_id
    INSERT INTO public.strategies (
      user_id,
      business_id,
      business_name,
      business_stage,
      vision,
      mission,
      target_market,
      revenue_model,
      value_proposition,
      key_partners,
      marketing_approach,
      operational_needs,
      growth_goals
    ) VALUES (
      (p_strategy_data->>'user_id')::uuid,
      v_business_id,
      p_strategy_data->>'business_name',
      (p_strategy_data->>'business_stage')::public.business_stage,
      p_strategy_data->>'vision',
      p_strategy_data->>'mission',
      p_strategy_data->>'target_market',
      p_strategy_data->>'revenue_model',
      p_strategy_data->>'value_proposition',
      p_strategy_data->>'key_partners',
      p_strategy_data->>'marketing_approach',
      p_strategy_data->>'operational_needs',
      p_strategy_data->>'growth_goals'
    )
    RETURNING id INTO v_strategy_id;

    -- Update the business with the strategy_id
    UPDATE public.businesses
    SET strategy_id = v_strategy_id
    WHERE id = v_business_id;

    -- Return the created strategy with its business
    SELECT to_jsonb(strategy) || jsonb_build_object(
      'business', to_jsonb(business)
    ) INTO v_result
    FROM public.strategies strategy
    LEFT JOIN public.businesses business ON business.id = strategy.business_id
    WHERE strategy.id = v_strategy_id;

    RETURN v_result;

  EXCEPTION WHEN OTHERS THEN
    -- Rollback the transaction on error
    RAISE EXCEPTION 'Error creating strategy with business: %', SQLERRM;
  END;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_strategy_with_business(jsonb, jsonb) TO authenticated;
