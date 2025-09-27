/**
 * Frontend API Client for Edge Functions
 * Provides typed interface to communicate with Supabase Edge Functions
 */

import { supabase } from '@/integrations/supabase/client';

// ==========================================
// Types matching the edge function schemas
// ==========================================

export interface User {
  id: string;
  email: string;
  full_name: string;
  account_type: string;
  country?: string;
  organization_name?: string;
  roles: string[];
  created_at: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  currency: string;
  category: string;
  description?: string;
  date: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface FinancialSummary {
  currency: string;
  totals: {
    income: number;
    expenses: number;
    netProfit: number;
    profitMargin: number;
  };
  breakdown: {
    incomeByCategory: Record<string, number>;
    expensesByCategory: Record<string, number>;
  };
  transactionCounts: {
    income: number;
    expenses: number;
    total: number;
  };
}

export interface OcrJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  file_path: string;
  expected_type: 'receipt' | 'invoice' | 'document';
  result?: Record<string, any>;
  error_message?: string;
  created_at: string;
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  meta: {
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface ApiResponse<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

// ==========================================
// API Client Class
// ==========================================

class EdgeFunctionsApiClient {
  private baseUrl: string;

  constructor() {
    const root = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
    this.baseUrl = `${root}/functions/v1`;
  }

  /**
   * Get authorization headers with current user token
   */
  private async getAuthHeaders(): Promise<Record<string, string>> {
    const { data: { session } } = await supabase.auth.getSession();
    const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token || ''}`,
      'apikey': anonKey,
    };
  }

  /**
   * Generic API request handler
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = await this.getAuthHeaders();

    const res = await fetch(`${this.baseUrl}/${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    // Read response as text first to preserve raw body for better errors
    const text = await res.text();
    let data: any = null;

    if (text) {
      try {
        data = JSON.parse(text);
      } catch (err) {
        // not JSON, keep raw text
        data = text;
      }
    }

    // If response is not ok, map common statuses and extract error details
    if (!res.ok || (data && data.success === false)) {
      const status = res.status;

      // Prefer structured error from JSON body when available
      const bodyError = (typeof data === 'object' && data !== null && (data.error || data.message || data?.data?.error))
        ? (data.error || { message: data.message } || data?.data?.error)
        : null;

      const mapped =
        status === 401 ? { code: '401', message: bodyError?.message || 'Invalid JWT' } :
        status === 403 ? { code: '403', message: bodyError?.message || 'Forbidden' } :
        status === 404 ? { code: '404', message: bodyError?.message || 'Endpoint not found' } :
        bodyError ? { code: bodyError.code || String(status), message: bodyError.message || String(bodyError) } :
        { code: String(status || 'UNKNOWN_ERROR'), message: (typeof data === 'string' ? data : (data?.message || res.statusText || 'An error occurred')) };

      // Attach endpoint and raw body for easier debugging
      (mapped as any).endpoint = endpoint;
      (mapped as any).status = status;
      (mapped as any).raw = text;

      throw new ApiError(mapped);
    }

    // Success - return parsed JSON object or empty object
    return (data ?? ({} as T));
  }

  // ==========================================
  // User Management API
  // ==========================================

  /**
   * Login via Supabase Auth and persist session
   */
  async login(email: string, password: string): Promise<{
    access_token: string;
    expires_in: number;
    refresh_token: string | null;
    user: { id: string; email: string | null };
  }> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session || !data.user) {
      throw new ApiError({ code: '401', message: error?.message || 'Invalid credentials' });
    }
    return {
      access_token: data.session.access_token,
      expires_in: data.session.expires_in ?? 3600,
      refresh_token: data.session.refresh_token ?? null,
      user: { id: data.user.id, email: data.user.email },
    };
  }

  /**
   * Get current user profile and roles
   */
  async getProfile(): Promise<User> {
    const response = await this.request<ApiResponse<User>>('user-management/me');
    return response.data;
  }

  /** Alias for compatibility */
  async getCurrentUser(): Promise<User> {
    return this.getProfile();
  }

  /**
   * Update current user's profile
   */
  async updateProfile(updates: Partial<Pick<User, 'full_name' | 'account_type' | 'country' | 'organization_name'>>): Promise<User> {
    const response = await this.request<ApiResponse<User>>('user-management/me', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    return response.data;
  }

  /** Alias for compatibility */
  async updateMyProfile(updates: Partial<Pick<User, 'full_name' | 'account_type' | 'country' | 'organization_name'>>): Promise<User> {
    return this.updateProfile(updates);
  }

  /**
   * Get users list (admin only)
   */
  async getUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    accountType?: string;
  } = {}): Promise<PaginatedResponse<User>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.set(key, String(value));
    });

    return this.request<PaginatedResponse<User>>(
      `user-management?${queryParams.toString()}`
    );
  }

  /**
   * Update user role (admin only)
   */
  async updateUserRole(
    userId: string,
    role: string,
    action: 'add' | 'remove'
  ): Promise<{ message: string }> {
    // Validate required fields client-side to avoid 400s
    if (!userId || !role || !action) {
      throw new ApiError({ code: 'MISSING_REQUIRED_FIELD', message: 'userId, role and action are required' });
    }

    const response = await this.request<ApiResponse<{ message: string }>>('user-management/roles', {
      method: 'POST',
      body: JSON.stringify({ userId, role, action }),
    });
    return response.data;
  }

  /**
   * Admin update user (super admin only)
   */
  async adminUpdateUser(
    userId: string, 
    updates: Partial<Pick<User, 'full_name' | 'account_type' | 'country' | 'organization_name'>>
  ): Promise<User> {
    const response = await this.request<ApiResponse<User>>(`user-management?userId=${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    return response.data;
  }

  /**
   * Deactivate user (super admin only)
   */
  async deactivateUser(userId: string): Promise<{ message: string }> {
    const response = await this.request<ApiResponse<{ message: string }>>(`user-management?userId=${userId}`, {
      method: 'DELETE',
    });
    return response.data;
  }

  // ==========================================
  // Financial Management API
  // ==========================================

  /**
   * Get user's financial transactions
   */
  async getTransactions(params: {
    page?: number;
    limit?: number;
    type?: 'income' | 'expense';
    category?: string;
    currency?: string;
    date_from?: string;
    date_to?: string;
    min_amount?: number;
    max_amount?: number;
    sort_by?: 'transaction_date' | 'amount' | 'created_at';
    sort_order?: 'asc' | 'desc';
  } = {}): Promise<PaginatedResponse<Transaction>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.set(key, String(value));
    });

    return this.request<PaginatedResponse<Transaction>>(
      `financial-management/transactions?${queryParams.toString()}`
    );
  }

  /**
   * Create new financial transaction
   */
  async createTransaction(transaction: {
    type: 'income' | 'expense';
    amount: number;
    currency: string;
    category: string;
    description?: string;
    transaction_date?: string;
    metadata?: Record<string, any>;
  }): Promise<Transaction> {
    const response = await this.request<ApiResponse<Transaction>>('financial-management/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
    return response.data;
  }

  /**
   * Update financial transaction
   */
  async updateTransaction(
    transactionId: string, 
    updates: Partial<Omit<Transaction, 'id' | 'created_at'>>
  ): Promise<Transaction> {
    const response = await this.request<ApiResponse<Transaction>>(`financial-management/transactions/${transactionId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    return response.data;
  }

  /**
   * Delete financial transaction
   */
  async deleteTransaction(transactionId: string): Promise<{ message: string }> {
    const response = await this.request<ApiResponse<{ message: string }>>(`financial-management/transactions/${transactionId}`, {
      method: 'DELETE',
    });
    return response.data;
  }

  /**
   * Get financial summary with calculations
   */
  async getFinancialSummary(params: {
    currency?: string;
    date_from?: string;
    date_to?: string;
  } = {}): Promise<FinancialSummary> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.set(key, String(value));
    });

    const response = await this.request<ApiResponse<FinancialSummary>>(
      `financial-management/summary?${queryParams.toString()}`
    );
    return response.data;
  }

  /**
   * Process OCR job for receipt/document
   */
  async processOcrJob(data: {
    file_path: string;
    file_type: 'image/jpeg' | 'image/png' | 'image/webp';
    expected_type?: 'receipt' | 'invoice' | 'document';
  }): Promise<OcrJob> {
    const response = await this.request<ApiResponse<OcrJob>>('financial-management/ocr', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  /**
   * Get user's OCR jobs
   */
  async getOcrJobs(params: {
    page?: number;
    limit?: number;
    status?: 'pending' | 'processing' | 'completed' | 'failed';
    date_from?: string;
    date_to?: string;
  } = {}): Promise<PaginatedResponse<OcrJob>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.set(key, String(value));
    });

    return this.request<PaginatedResponse<OcrJob>>(
      `financial-management/ocr?${queryParams.toString()}`
    );
  }
}

// Create singleton instance
export const apiClient = new EdgeFunctionsApiClient();

// Export error type for error handling
export class ApiError extends Error {
  constructor(public error: { code: string; message: string; details?: any }) {
    super(error.message);
    this.name = 'ApiError';
  }
}
