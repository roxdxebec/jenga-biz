import { supabase } from '@/integrations/supabase/client';

export interface FinancialRecord {
  id: string;
  strategy_id: string;
  amount: number;
  record_date: string;
  description: string;
  category: 'revenue' | 'expense' | 'investment';
  created_at: string;
  updated_at: string;
  // For backward compatibility
  business_id?: string;
}

export class StrategyFinancialsService {
  /**
   * Get all financial records for a strategy
   */
  static async getFinancialRecords(strategyId: string): Promise<FinancialRecord[]> {
    const { data, error } = await supabase
      .from('financial_records')
      .select('*')
      .eq('strategy_id', strategyId)
      .order('record_date', { ascending: false });

    if (error) {
      console.error('Error fetching strategy financial records:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Create a new financial record for a strategy
   */
  static async createFinancialRecord(
    strategyId: string,
    record: Omit<FinancialRecord, 'id' | 'strategy_id' | 'created_at' | 'updated_at'>
  ): Promise<FinancialRecord> {
    const { data, error } = await supabase
      .from('financial_records')
      .insert([{ ...record, strategy_id: strategyId }])
      .select()
      .single();

    if (error) {
      console.error('Error creating financial record:', error);
      throw error;
    }

    return data;
  }

  /**
   * Update a financial record
   */
  static async updateFinancialRecord(
    id: string,
    updates: Partial<Omit<FinancialRecord, 'id' | 'strategy_id' | 'created_at' | 'updated_at'>>
  ): Promise<FinancialRecord> {
    const { data, error } = await supabase
      .from('financial_records')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating financial record:', error);
      throw error;
    }

    return data;
  }

  /**
   * Delete a financial record
   */
  static async deleteFinancialRecord(id: string): Promise<void> {
    const { error } = await supabase
      .from('financial_records')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting financial record:', error);
      throw error;
    }
  }
}
