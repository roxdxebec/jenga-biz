import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

// DB row types using generated Supabase types
type DbBusiness = Tables<'businesses'>;
type DbStrategyRow = Tables<'strategies'>;
type DbMilestoneRow = Tables<'milestones'>;

type DbBusinessInsert = TablesInsert<'businesses'>;
type DbStrategyInsert = TablesInsert<'strategies'>;
type DbMilestoneInsert = TablesInsert<'milestones'>;

// Exported domain types (normalized shapes returned by this client)
export type Business = DbBusiness;
export type Milestone = DbMilestoneRow;
export type Strategy = DbStrategyRow & {
  milestones: Milestone[];
  business?: Business | null;
};

// Input types used by higher-level code (allow file upload field for business)
export type BusinessInput = DbBusinessInsert & { registration_certificate_file?: File | null; registration_certificate_url?: string | null };
export type StrategyInput = DbStrategyInsert;
export type MilestoneInput = DbMilestoneInsert;

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
      return data as Business;
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
      return data as Business;
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
      return data as Business;
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
      return (data || []) as Business[];
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
      const { data: publicData } = supabase.storage
        .from('business-documents')
        .getPublicUrl(filePath) as any;

      return (publicData as any)?.publicUrl || '';
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
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      const rows = (strategies || []) as unknown as Array<DbStrategyRow & { milestones?: DbMilestoneRow[]; business?: DbBusiness }>;
      return rows.map(r => ({
        ...r,
        milestones: (r.milestones || []) as Milestone[],
        business: r.business || null,
      }));
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

    const row = data as unknown as (DbStrategyRow & { milestones?: DbMilestoneRow[]; business?: DbBusiness });
    return {
      ...row,
      milestones: (row.milestones || []) as Milestone[],
      business: row.business || null,
    } as Strategy;
  }

  async createStrategy(strategyData: Omit<StrategyInput, 'id' | 'created_at' | 'updated_at'>): Promise<Strategy> {
    const { data, error } = await supabase
      .from('strategies')
      .insert([strategyData as any])
      .select()
      .single();

    if (error) {
      console.error('Error creating strategy:', error);
      throw error;
    }

    // Created strategy rows won't include related milestones/business by default
    const created = data as DbStrategyRow;
    return { ...created, milestones: [] } as Strategy;
  }

  async updateStrategy(id: string, updates: Partial<StrategyInput>): Promise<Strategy> {
    const { data, error } = await supabase
      .from('strategies')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating strategy:', error);
      throw error;
    }

    const updated = data as DbStrategyRow;
    return { ...updated, milestones: [] } as Strategy;
  }

  // Milestone Methods
  async createMilestone(milestone: Omit<Milestone, 'id' | 'created_at' | 'updated_at'>): Promise<Milestone> {
    if (!milestone.strategy_id) {
      throw new Error('strategy_id is required to create a milestone');
    }

    const { data, error } = await supabase
      .from('milestones')
      .insert([milestone as any])
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
      .update(updates as any)
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

  // Delete a strategy and its related milestones (safe operation)
  async deleteStrategy(id: string): Promise<void> {
    try {
      // Attempt to remove milestones first to avoid FK constraint issues
      const { error: milestonesError } = await supabase
          .from('milestones')
          .delete()
          .eq('strategy_id', id);

        if (milestonesError) {
          console.error('Error deleting related milestones for strategy:', milestonesError);
          throw milestonesError;
        }

        const { error } = await supabase
          .from('strategies')
          .delete()
          .eq('id', id);

        if (error) throw error;
    } catch (error) {
      console.error('Error deleting strategy:', error);
      throw error;
    }
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
          business_id: businessData ? undefined : (strategyData as any).business_id,
        },
        milestones_data: milestonesData.map(milestone => ({
            ...milestone,
            // Ensure strategy_id is set from provided strategy id when available
            strategy_id: milestone.strategy_id || strategyData.id,
          }))
      };

      // Add business data if provided
      if (businessData) {
        payload.business_data = businessData;
      }

      // Call the database function
      // PostgREST requires the RPC parameters to match the function signature.
      // The DB function expects named parameters: p_business_data, p_milestones_data, p_strategy_data
      const rpcPayload = {
        p_business_data: payload.business_data || null,
        p_milestones_data: payload.milestones_data || [],
        p_strategy_data: payload.strategy_data || {}
      };

      const { data, error } = await (supabase.rpc as any)(
        'create_or_update_strategy_with_business',
        rpcPayload
      ).single();

      if (error) {
        console.error('Database error:', error);
        throw new Error(error.message || 'Failed to save strategy with business and milestones');
      }

      if (!data) {
        throw new Error('No data returned from the database');
      }

      // The RPC returns a composite object: { strategy, milestones, business }
      const responseData = data as {
        strategy: DbStrategyRow;
        milestones: DbMilestoneRow[];
        business: DbBusiness | null;
      };

      return {
        strategy: { ...responseData.strategy, milestones: responseData.milestones || [], business: responseData.business || null } as Strategy,
        milestones: responseData.milestones || [],
        business: responseData.business || undefined
      };
    } catch (error) {
      console.error('Error in saveStrategyWithBusinessAndMilestones:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const strategyClient = new StrategyClient();