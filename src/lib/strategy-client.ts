import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

type Nullable<T> = T | null;

export type BusinessStage = 'idea' | 'launch' | 'growth' | 'scale' | 'ideation';
export type MilestoneStatus = 'pending' | 'approved' | 'rejected' | 'expired' | 'cancelled';
export type MilestoneType = 'business_registration' | 'first_customer' | 'first_hire' | 'break_even' | 'loan_application' | 'investment_ready' | 'other';

export interface BusinessInput {
  user_id: string;
  hub_id?: string | null;
  name: string;
  business_type?: string | null;
  stage?: BusinessStage | null;
  description?: string | null;
  registration_number?: string | null;
  registration_certificate_url?: string | null;
  is_active?: boolean | null;
  registration_certificate_file?: File | null;
}

// Database types
export interface Business {
  id: string;
  user_id: string;
  hub_id: string | null;
  name: string;
  business_type: string | null;
  stage: BusinessStage | null;
  description: string | null;
  registration_number: string | null;
  registration_certificate_url: string | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface Strategy {
  id: string;
  user_id: string;
  business_id: string;
  business_name: string;
  business_stage: BusinessStage;
  vision: string;
  mission: string;
  target_market: string;
  revenue_model: string;
  value_proposition: string;
  key_partners: string;
  marketing_approach: string;
  operational_needs: string;
  growth_goals: string;
  created_at: string;
  updated_at: string;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  strategy_id: string;
  business_id: string;
  title: string;
  description: string;
  status: MilestoneStatus;
  target_date: Nullable<string>;
  created_at: string;
  updated_at: string;
  milestone_type: MilestoneType;
  completed_at: Nullable<string>;
}

// Input types
export interface StrategyInput {
  user_id: string;
  business_id?: string; // Optional for creation, will be set by the backend if not provided
  business_name: string;
  business_stage: BusinessStage;
  business_type?: string;
  description?: string;
  registration_number?: string;
  registration_certificate_url?: string;
  vision: string;
  mission: string;
  target_market: string;
  revenue_model: string;
  value_proposition: string;
  key_partners: string;
  marketing_approach: string;
  operational_needs: string;
  growth_goals: string;
}

export interface MilestoneInput {
  strategy_id: string;
  business_id: string;
  title: string;
  description: string;
  status: MilestoneStatus;
  target_date?: string | null;
  milestone_type: MilestoneType;
  completed_at?: string | null;
}

class StrategyClient {
  // Business Methods
  async createBusiness(businessData: BusinessInput): Promise<Business> {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .insert([businessData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating business:', error);
      throw error;
    }
  }

  async updateBusiness(id: string, updates: Partial<BusinessInput>): Promise<Business> {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating business:', error);
      throw error;
    }
  }

  async getBusiness(id: string): Promise<Business | null> {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error fetching business:', error);
      throw error;
    }
  }

  async getBusinessesByUser(userId: string): Promise<Business[]> {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching businesses:', error);
      throw error;
    }
  }

  async uploadBusinessCertificate(file: File, businessId: string): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${businessId}/registration.${fileExt}`;
      const filePath = `business-documents/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('business-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('business-documents')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading business certificate:', error);
      throw error;
    }
  }
  // Strategy Methods
  async getStrategies(userId: string): Promise<Strategy[]> {
    try {
      const { data: strategies, error } = await supabase
        .from('strategies')
        .select(`
          *,
          milestones:milestones(*)
        `)
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return strategies || [];
    } catch (error) {
      console.error('Error fetching strategies:', error);
      throw error;
    }
  }

  async getStrategyWithMilestones(id: string): Promise<Strategy> {
    if (!id) {
      throw new Error('Strategy ID is required');
    }

    const { data, error } = await supabase
      .from('strategies')
      .select(`
        *,
        milestones:milestones(*),
        business:businesses!strategies_business_id_fkey(
          id,
          name,
          business_type,
          stage,
          description,
          registration_number,
          registration_certificate_url,
          created_at,
          updated_at
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching strategy:', error);
      throw error;
    }

    return data as Strategy;
  }

  async createStrategy(strategyData: Omit<StrategyInput, 'id' | 'created_at' | 'updated_at'>): Promise<Strategy> {
    const { data, error } = await supabase
      .from('strategies')
      .insert([strategyData])
      .select()
      .single();

    if (error) {
      console.error('Error creating strategy:', error);
      throw error;
    }

    return data as Strategy;
  }

  async updateStrategy(id: string, updates: Partial<StrategyInput>): Promise<Strategy> {
    const { data, error } = await supabase
      .from('strategies')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating strategy:', error);
      throw error;
    }

    return data as Strategy;
  }

  // Milestone Methods
  async createMilestone(milestone: Omit<Milestone, 'id' | 'created_at' | 'updated_at'>): Promise<Milestone> {
    if (!milestone.strategy_id) {
      throw new Error('strategy_id is required to create a milestone');
    }

    const { data, error } = await supabase
      .from('milestones')
      .insert([milestone])
      .select()
      .single();

    if (error) throw error;
    return data as Milestone;
  }

  async updateMilestone(
    id: string, 
    updates: Partial<Omit<Milestone, 'id' | 'strategy_id' | 'created_at' | 'updated_at'>>
  ): Promise<Milestone> {
    const { data, error } = await supabase
      .from('milestones')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Milestone;
  }

  async deleteMilestone(id: string): Promise<void> {
    const { error } = await supabase
      .from('milestones')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Batch operations
  async saveStrategyWithMilestones(
    strategyData: Omit<StrategyInput, 'id' | 'created_at' | 'updated_at'>,
    milestonesData: Array<Omit<Milestone, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<{ strategy: Strategy; milestones: Milestone[] }> {
    // For backward compatibility, call the new method without business data
    const result = await this.saveStrategyWithBusinessAndMilestones(
      strategyData,
      undefined,
      milestonesData
    );
    
    return {
      strategy: result.strategy,
      milestones: result.milestones
    };
  }

  /**
   * Saves or updates a strategy along with its associated business and milestones in a single transaction.
   * If businessData is provided, it will create or update the business record.
   * All milestones will be recreated for the strategy.
   */
  async saveStrategyWithBusinessAndMilestones(
    strategyData: Omit<StrategyInput, 'id' | 'created_at' | 'updated_at'> & { id?: string },
    businessData?: Omit<BusinessInput, 'id' | 'created_at' | 'updated_at'> & { id?: string },
    milestonesData: Array<Omit<Milestone, 'id' | 'created_at' | 'updated_at'>> = []
  ): Promise<{ 
    strategy: Strategy; 
    milestones: Milestone[];
    business?: Business;
  }> {
    try {
      // Prepare the request payload
      const payload: any = {
        strategy_data: {
          ...strategyData,
          // Ensure business_id is not set if we're creating a new business
          business_id: businessData ? undefined : strategyData.business_id,
        },
        milestones_data: milestonesData.map(milestone => ({
          ...milestone,
          // Ensure business_id is set from strategy if not provided
          business_id: milestone.business_id || strategyData.business_id,
        }))
      };

      // Add business data if provided
      if (businessData) {
        payload.business_data = businessData;
      }

      // Call the database function
      const { data, error } = await (supabase.rpc as any)(
        'create_or_update_strategy_with_business',
        payload
      ).single();

      if (error) {
        console.error('Database error:', error);
        throw new Error(error.message || 'Failed to save strategy with business and milestones');
      }

      if (!data) {
        throw new Error('No data returned from the database');
      }

      // Type assertion for the response data
      const responseData = data as {
        strategy: Strategy;
        milestones?: Milestone[];
        business?: Business;
      };

      // Return the results
      return {
        strategy: responseData.strategy,
        milestones: responseData.milestones || [],
        business: responseData.business
      };
    } catch (error) {
      console.error('Error in saveStrategyWithBusinessAndMilestones:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const strategyClient = new StrategyClient();