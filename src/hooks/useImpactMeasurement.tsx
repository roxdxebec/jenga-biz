import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface JobCreationRecord {
  id: string;
  business_id: string;
  recorded_date: string;
  jobs_created: number;
  job_type?: string;
  employment_type: string;
  skill_level: string;
  average_wage?: number;
  benefits_provided: boolean;
  gender_breakdown: {
    male: number;
    female: number;
    other: number;
  };
  age_breakdown: {
    '18-25': number;
    '26-35': number;
    '36-45': number;
    '46-55': number;
    '55+': number;
  };
  retention_rate?: number;
}

export interface LoanReadinessAssessment {
  id: string;
  business_id: string;
  assessment_date: string;
  credit_score?: number;
  revenue_stability_score?: number;
  cash_flow_score?: number;
  debt_to_income_ratio?: number;
  collateral_value: number;
  business_plan_score?: number;
  financial_documentation_score?: number;
  overall_readiness_score?: number;
  readiness_level?: 'not_ready' | 'partially_ready' | 'loan_ready' | 'highly_qualified';
  recommendations?: string[];
}

export interface FinanceAccessRecord {
  id: string;
  business_id: string;
  record_date: string;
  funding_source: string;
  funding_type: string;
  amount_requested?: number;
  amount_approved?: number;
  amount_disbursed?: number;
  interest_rate?: number;
  loan_term_months?: number;
  purpose?: string;
  application_status: string;
  rejection_reason?: string;
  notes?: string;
}

export interface BusinessSurvivalRecord {
  id: string;
  business_id: string;
  assessment_date: string;
  months_in_operation: number;
  is_active: boolean;
  closure_date?: string;
  closure_reason?: string;
  revenue_trend?: string;
  employee_count: number;
  survival_risk_score?: number;
  risk_factors?: string[];
  support_interventions?: string[];
}

export interface ImpactMetrics {
  totalJobsCreated: number;
  averageJobsPerBusiness: number;
  jobRetentionRate: number;
  businessSurvivalRate: number;
  averageSurvivalMonths: number;
  loanReadinessDistribution: { [key: string]: number };
  financeAccessSuccess: number;
  totalFundingSecured: number;
}

export const useImpactMeasurement = (businessId?: string) => {
  const [jobRecords, setJobRecords] = useState<JobCreationRecord[]>([]);
  const [loanAssessments, setLoanAssessments] = useState<LoanReadinessAssessment[]>([]);
  const [financeRecords, setFinanceRecords] = useState<FinanceAccessRecord[]>([]);
  const [survivalRecords, setSurvivalRecords] = useState<BusinessSurvivalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch job creation records
  const fetchJobRecords = async () => {
    try {
      const { getCurrentHubIdFromStorage } = await import('@/lib/tenant');
      const hubId = getCurrentHubIdFromStorage();

      let query = supabase.from('job_creation_records').select('*');
      if (businessId) {
        query = query.eq('business_id', businessId);
      } else if (hubId) {
        try {
          query = query.eq('hub_id', hubId);
        } catch (e) {
          // no-op, will be handled below
        }
      }

      let res = await query.order('recorded_date', { ascending: false });
      if (res.error && String(res.error.message || res.error).includes('does not exist')) {
        // retry without hub filter
        res = await supabase.from('job_creation_records').select('*').order('recorded_date', { ascending: false });
      }

      const { data, error } = res;
      if (error) throw error;
      setJobRecords((data || []).map((record: any) => ({
        ...record,
        job_type: record.job_type ?? undefined,
        gender_breakdown: record.gender_breakdown as { male: number; female: number; other: number },
        age_breakdown: record.age_breakdown as { '18-25': number; '26-35': number; '36-45': number; '46-55': number; '55+': number }
      })));
    } catch (err) {
      console.error('Error fetching job records:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch job records');
    }
  };

  // Fetch loan readiness assessments
  const fetchLoanAssessments = async () => {
    try {
      const { getCurrentHubIdFromStorage } = await import('@/lib/tenant');
      const hubId = getCurrentHubIdFromStorage();

      let query = supabase.from('loan_readiness_assessments').select('*');
      if (businessId) {
        query = query.eq('business_id', businessId);
      } else if (hubId) {
        try { query = query.eq('hub_id', hubId); } catch (e) {}
      }

      let res = await query.order('assessment_date', { ascending: false });
      if (res.error && String(res.error.message || res.error).includes('does not exist')) {
        res = await supabase.from('loan_readiness_assessments').select('*').order('assessment_date', { ascending: false });
      }

      const { data, error } = res;
      if (error) throw error;
      setLoanAssessments((data || []).map((assessment: any) => ({
        ...assessment,
        credit_score: assessment.credit_score ?? undefined,
        readiness_level: assessment.readiness_level as 'not_ready' | 'partially_ready' | 'loan_ready' | 'highly_qualified' | undefined,
        recommendations: assessment.recommendations as string[] | undefined
      })));
    } catch (err) {
      console.error('Error fetching loan assessments:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch loan assessments');
    }
  };

  // Fetch finance access records
  const fetchFinanceRecords = async () => {
    try {
      const { getCurrentHubIdFromStorage } = await import('@/lib/tenant');
      const hubId = getCurrentHubIdFromStorage();

      let query = supabase.from('finance_access_records').select('*');
      if (businessId) {
        query = query.eq('business_id', businessId);
      } else if (hubId) {
        try { query = query.eq('hub_id', hubId); } catch (e) {}
      }

      let res = await query.order('record_date', { ascending: false });
      if (res.error && String(res.error.message || res.error).includes('does not exist')) {
        res = await supabase.from('finance_access_records').select('*').order('record_date', { ascending: false });
      }

      const { data, error } = res;
      if (error) throw error;
  setFinanceRecords((data || []) as any[]);
    } catch (err) {
      console.error('Error fetching finance records:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch finance records');
    }
  };

  // Fetch business survival records
  const fetchSurvivalRecords = async () => {
    try {
      const { getCurrentHubIdFromStorage } = await import('@/lib/tenant');
      const hubId = getCurrentHubIdFromStorage();

      let query = supabase.from('business_survival_records').select('*');
      if (businessId) {
        query = query.eq('business_id', businessId);
      } else if (hubId) {
        try { query = query.eq('hub_id', hubId); } catch (e) {}
      }

      let res = await query.order('assessment_date', { ascending: false });
      if (res.error && String(res.error.message || res.error).includes('does not exist')) {
        res = await supabase.from('business_survival_records').select('*').order('assessment_date', { ascending: false });
      }

      const { data, error } = res;
      if (error) throw error;
  setSurvivalRecords((data || []) as any[]);
    } catch (err) {
      console.error('Error fetching survival records:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch survival records');
    }
  };

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    await Promise.all([
      fetchJobRecords(),
      fetchLoanAssessments(),
      fetchFinanceRecords(),
      fetchSurvivalRecords()
    ]);
    
    setLoading(false);
  };

  // Add job creation record
  const addJobRecord = async (record: Omit<JobCreationRecord, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('job_creation_records')
        .insert([record])
        .select()
        .single();
      
      if (error) throw error;
      
      await fetchJobRecords();
      return data;
    } catch (err) {
      console.error('Error adding job record:', err);
      throw err;
    }
  };

  // Add loan readiness assessment
  const addLoanAssessment = async (assessment: Omit<LoanReadinessAssessment, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('loan_readiness_assessments')
        .insert([assessment])
        .select()
        .single();
      
      if (error) throw error;
      
      await fetchLoanAssessments();
      return data;
    } catch (err) {
      console.error('Error adding loan assessment:', err);
      throw err;
    }
  };

  // Add finance access record
  const addFinanceRecord = async (record: Omit<FinanceAccessRecord, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('finance_access_records')
        .insert([record])
        .select()
        .single();
      
      if (error) throw error;
      
      await fetchFinanceRecords();
      return data;
    } catch (err) {
      console.error('Error adding finance record:', err);
      throw err;
    }
  };

  // Add business survival record
  const addSurvivalRecord = async (record: Omit<BusinessSurvivalRecord, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('business_survival_records')
        .insert([record])
        .select()
        .single();
      
      if (error) throw error;
      
      await fetchSurvivalRecords();
      return data;
    } catch (err) {
      console.error('Error adding survival record:', err);
      throw err;
    }
  };

  // Calculate impact metrics
  const impactMetrics = useMemo((): ImpactMetrics => {
    const totalJobsCreated = jobRecords.reduce((sum, record) => sum + record.jobs_created, 0);
    const activeBusinesses = survivalRecords.filter(record => record.is_active).length;
    const averageJobsPerBusiness = activeBusinesses > 0 ? totalJobsCreated / activeBusinesses : 0;
    
    const totalJobs = jobRecords.reduce((sum, record) => sum + record.jobs_created, 0);
    const retentionSum = jobRecords.reduce((sum, record) => {
      return sum + (record.retention_rate || 0) * record.jobs_created;
    }, 0);
    const jobRetentionRate = totalJobs > 0 ? retentionSum / totalJobs : 0;
    
    const totalBusinesses = survivalRecords.length;
    const activeCount = survivalRecords.filter(record => record.is_active).length;
    const businessSurvivalRate = totalBusinesses > 0 ? (activeCount / totalBusinesses) * 100 : 0;
    
    const averageSurvivalMonths = survivalRecords.length > 0 
      ? survivalRecords.reduce((sum, record) => sum + record.months_in_operation, 0) / survivalRecords.length 
      : 0;
    
    const loanReadinessDistribution = loanAssessments.reduce((dist, assessment) => {
      const level = assessment.readiness_level || 'not_ready';
      dist[level] = (dist[level] || 0) + 1;
      return dist;
    }, {} as { [key: string]: number });
    
    const approvedFinance = financeRecords.filter(record => 
      record.application_status === 'approved' || record.application_status === 'disbursed'
    );
    const financeAccessSuccess = financeRecords.length > 0 
      ? (approvedFinance.length / financeRecords.length) * 100 
      : 0;
    
    const totalFundingSecured = approvedFinance.reduce((sum, record) => 
      sum + (record.amount_disbursed || record.amount_approved || 0), 0
    );

    return {
      totalJobsCreated,
      averageJobsPerBusiness,
      jobRetentionRate,
      businessSurvivalRate,
      averageSurvivalMonths,
      loanReadinessDistribution,
      financeAccessSuccess,
      totalFundingSecured
    };
  }, [jobRecords, loanAssessments, financeRecords, survivalRecords]);

  useEffect(() => {
    fetchData();
  }, [businessId]);

  return {
    jobRecords,
    loanAssessments,
    financeRecords,
    survivalRecords,
    impactMetrics,
    loading,
    error,
    fetchData,
    addJobRecord,
    addLoanAssessment,
    addFinanceRecord,
    addSurvivalRecord
  };
};
