/**
 * Financial Hooks using Edge Functions
 * Replaces direct database operations with secure API calls
 */

// @ts-nocheck
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, type Transaction, type FinancialSummary, type OcrJob, ApiError } from '@/lib/api-client';
import { useToast } from './use-toast';

// ==========================================
// Transaction Management Hooks
// ==========================================

export function useTransactions(params: {
  page?: number;
  limit?: number;
  type?: 'income' | 'expense';
  category?: string;
  currency?: string;
  date_from?: string;
  date_to?: string;
} = {}) {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => apiClient.getTransactions(params),
    staleTime: 30000, // 30 seconds
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (transaction: {
      type: 'income' | 'expense';
      amount: number;
      currency: string;
      category: string;
      description?: string;
      transaction_date?: string;
    }) => apiClient.createTransaction(transaction),
    onSuccess: (data) => {
      // Invalidate transactions queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['financial-summary'] });
      
      toast({
        title: 'Transaction Added',
        description: `${data.type === 'income' ? 'Income' : 'Expense'} of ${data.currency} ${data.amount} recorded successfully.`,
      });
    },
    onError: (error: ApiError) => {
      toast({
        title: 'Error',
        description: error.error.message || 'Failed to create transaction',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ 
      transactionId, 
      updates 
    }: { 
      transactionId: string; 
      updates: Partial<Transaction> 
    }) => apiClient.updateTransaction(transactionId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['financial-summary'] });
      
      toast({
        title: 'Transaction Updated',
        description: 'Transaction updated successfully',
      });
    },
    onError: (error: ApiError) => {
      toast({
        title: 'Error',
        description: error.error.message || 'Failed to update transaction',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (transactionId: string) => apiClient.deleteTransaction(transactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['financial-summary'] });
      
      toast({
        title: 'Transaction Deleted',
        description: 'Transaction deleted successfully',
      });
    },
    onError: (error: ApiError) => {
      toast({
        title: 'Error',
        description: error.error.message || 'Failed to delete transaction',
        variant: 'destructive',
      });
    },
  });
}

// ==========================================
// Financial Summary Hook
// ==========================================

export function useFinancialSummary(params: {
  currency?: string;
  date_from?: string;
  date_to?: string;
} = {}) {
  return useQuery({
    queryKey: ['financial-summary', params],
    queryFn: () => apiClient.getFinancialSummary(params),
    staleTime: 60000, // 1 minute
  });
}

// Custom hook for financial tracker component logic
export function useFinancialTracker(currency = 'KES', strategyId?: string) {
  const [newTransaction, setNewTransaction] = useState({
    type: 'income' as 'income' | 'expense',
    amount: '',
    description: '',
    category: ''
  });

  // Get transactions
  const { data: transactionsData, isLoading: transactionsLoading } = useTransactions({
    currency,
    limit: 50, // Get recent transactions
  });

  // Get financial summary
  const { data: summary, isLoading: summaryLoading } = useFinancialSummary({
    currency,
  });

  // Create transaction mutation
  const createTransactionMutation = useCreateTransaction();

  const transactions = transactionsData?.data || [];
  const loading = transactionsLoading || summaryLoading;

  const totalIncome = summary?.totals.income || 0;
  const totalExpenses = summary?.totals.expenses || 0;
  const netProfit = summary?.totals.netProfit || 0;

  const addTransaction = async () => {
    if (!newTransaction.amount || !newTransaction.category) {
      throw new Error('Please fill in all required fields');
    }

    const transactionData = {
      type: newTransaction.type,
      amount: parseFloat(newTransaction.amount),
      currency,
      category: newTransaction.category,
      description: newTransaction.description || `${newTransaction.type} - ${new Date().toLocaleDateString()}`,
      ...(strategyId && { metadata: { strategy_id: strategyId } }),
    };

    await createTransactionMutation.mutateAsync(transactionData);

    // Reset form
    setNewTransaction({
      type: 'income',
      amount: '',
      description: '',
      category: ''
    });
  };

  return {
    transactions,
    loading,
    totalIncome,
    totalExpenses,
    netProfit,
    newTransaction,
    setNewTransaction,
    addTransaction,
    isProcessing: createTransactionMutation.isPending,
  };
}

// ==========================================
// OCR Hooks
// ==========================================

export function useOcrJobs(params: {
  page?: number;
  limit?: number;
  status?: 'pending' | 'processing' | 'completed' | 'failed';
} = {}) {
  return useQuery({
    queryKey: ['ocr-jobs', params],
    queryFn: () => apiClient.getOcrJobs(params),
    staleTime: 10000, // 10 seconds
  });
}

export function useProcessOcr() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: {
      file_path: string;
      file_type: 'image/jpeg' | 'image/png' | 'image/webp';
      expected_type?: 'receipt' | 'invoice' | 'document';
    }) => apiClient.processOcrJob(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['ocr-jobs'] });
      
      toast({
        title: 'OCR Job Created',
        description: 'Receipt processing started. You will be notified when complete.',
      });
    },
    onError: (error: ApiError) => {
      toast({
        title: 'OCR Failed',
        description: error.error.message || 'Failed to process receipt',
        variant: 'destructive',
      });
    },
  });
}

// ==========================================
// Migration Helper Hook
// ==========================================

/**
 * Helper hook to ease migration from old FinancialTracker component
 * Provides the same interface but uses edge functions under the hood
 */
export function useFinancialTrackerMigration(
  language = 'en', 
  currency = 'KES', 
  currencySymbol = 'KSh',
  strategyId?: string
) {
  const financialData = useFinancialTracker(currency, strategyId);
  const processOcrMutation = useProcessOcr();

  // Legacy interface for easier migration
  const processReceiptImage = async (file: File) => {
    try {
      // In a real implementation, you would first upload the file to Supabase Storage
      // and get the file path, then call the OCR service
      
      // For now, simulate the OCR process
      console.log('Processing receipt image:', file.name);
      
      // This would be the actual implementation:
      // 1. Upload file to Supabase Storage
      // 2. Get the file path
      // 3. Call OCR service
      
      const mockFilePath = `receipts/${Date.now()}_${file.name}`;
      
      await processOcrMutation.mutateAsync({
        file_path: mockFilePath,
        file_type: file.type as 'image/jpeg' | 'image/png' | 'image/webp',
        expected_type: 'receipt',
      });
      
      return { success: true };
    } catch (error) {
      console.error('OCR processing failed:', error);
      throw error;
    }
  };

  return {
    ...financialData,
    language,
    currency,
    currencySymbol,
    processReceiptImage,
    isProcessingImage: processOcrMutation.isPending,
  };
}