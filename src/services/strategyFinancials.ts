import { supabase } from '@/integrations/supabase/client';

export interface FinancialRecord {
  id: string;
  strategy_id: string | null;
  amount: number;
  transaction_date: string;
  transaction_type?: string;
  description: string;
  category?: string;
  currency?: string | undefined;
  created_at: string;
  updated_at: string;
  user_id?: string;
  // For backward compatibility
  business_id?: string;
}

export class StrategyFinancialsService {
  /**
   * Get all financial records for a strategy
   */
  static async getFinancialRecords(strategyId: string): Promise<FinancialRecord[]> {
    try {
      // Try to find the strategy to get its business_id
      const { data: strat, error: stratErr } = await supabase
        .from('strategies')
        .select('business_id')
        .eq('id', strategyId)
        .single();

      if (!stratErr && strat && strat.business_id) {
        // Query aggregated financial_records for this business
        const { data: frData, error: frErr } = await supabase
          .from('financial_records')
          .select('*')
          .eq('business_id', strat.business_id)
          .order('record_date', { ascending: false });

        if (!frErr && frData && frData.length > 0) {
          // Transform aggregated records into FinancialRecord-style rows
          return frData.map((r: any) => ({
            id: r.id,
            strategy_id: strategyId,
            amount: Number(r.amount) || 0,
            transaction_date: r.record_date,
            transaction_type: r.metric_type || 'aggregate',
            description: r.notes || `Aggregated ${r.metric_type}`,
            category: r.metric_type || 'aggregated',
            currency: (r as any).currency ?? undefined,
            created_at: r.created_at,
            updated_at: r.updated_at,
            user_id: undefined,
            business_id: r.business_id
          }));
        }
      }

      // Fallback to detailed transactions
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('strategy_id', strategyId)
        .order('transaction_date', { ascending: false });

      if (error) {
        console.error('Error fetching strategy financial records:', error);
        throw error;
      }
      const rows = data || [];
      // Normalize rows to FinancialRecord shape
      return rows.map((r: any) => ({
        id: r.id,
        strategy_id: r.strategy_id ?? null,
        amount: Number(r.amount) || 0,
        transaction_date: r.transaction_date || r.record_date,
        transaction_type: r.transaction_type,
        description: r.description,
        category: r.category,
        currency: r.currency ?? null,
        created_at: r.created_at,
        updated_at: r.updated_at,
        user_id: r.user_id,
        business_id: r.business_id
      }));
    } catch (err) {
      console.error('Error in getFinancialRecords fallback:', err);
      throw err;
    }
  }

  /**
   * Create a new financial record for a strategy
   */
  static async createFinancialRecord(
    strategyId: string,
    record: Omit<FinancialRecord, 'id' | 'strategy_id' | 'created_at' | 'updated_at'>
  ): Promise<FinancialRecord> {
    // Ensure transaction_date key exists (accept legacy record_date)
    const txnPayload: any = {
      ...record,
      strategy_id: strategyId,
      transaction_date: (record as any).transaction_date || (record as any).record_date || new Date().toISOString().split('T')[0],
      transaction_type: (record as any).transaction_type || (record as any).category || 'transaction'
    };

    // attach current user id if available
    try {
      const userRes = await supabase.auth.getUser();
      if (userRes?.data?.user?.id) txnPayload.user_id = userRes.data.user.id;
    } catch (e) {
      // ignore
    }

    const { data, error } = await supabase
      .from('financial_transactions')
      .insert([txnPayload as any])
      .select()
      .single();

    if (error) {
      console.error('Error creating financial record:', error);
      throw error;
    }

    // normalize
    return data as any;
  }

  /**
   * Update a financial record
   */
  static async updateFinancialRecord(
    id: string,
    updates: Partial<Omit<FinancialRecord, 'id' | 'strategy_id' | 'created_at' | 'updated_at'>>
  ): Promise<FinancialRecord> {
    const updatesPayload: any = { ...updates };
    if ((updates as any).record_date && !(updates as any).transaction_date) {
      updatesPayload.transaction_date = (updates as any).record_date;
      delete updatesPayload.record_date;
    }

    const { data, error } = await supabase
      .from('financial_transactions')
      .update(updatesPayload as any)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating financial record:', error);
      throw error;
    }

    return data as any;
  }

  /**
   * Delete a financial record
   */
  static async deleteFinancialRecord(id: string): Promise<void> {
    const { error } = await supabase
      .from('financial_transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting financial record:', error);
      throw error;
    }
  }
}
