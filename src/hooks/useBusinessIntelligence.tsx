// @ts-nocheck
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { isPending, markPending } from '@/lib/dedupe';

interface StageCompletionRate {
  stage_name: string;
  total_starts: number;
  total_completions: number;
  completion_rate: number;
  avg_time_to_complete: number;
}

interface DropOffPoint {
  page_path: string;
  total_entries: number;
  total_exits: number;
  drop_off_rate: number;
  avg_time_on_page: number;
}

interface TemplateAnalytics {
  template_id: string;
  template_name: string;
  total_selections: number;
  total_completions: number;
  completion_rate: number;
  avg_completion_time: number;
}

interface MilestoneAnalytics {
  total_milestones: number;
  completed_milestones: number;
  overdue_milestones: number;
  avg_completion_time: number;
  milestones_by_stage: Array<{
    business_stage: string;
    count: number;
    completion_rate: number;
  }>;
}

export const useBusinessIntelligence = () => {
  const { user } = useAuth();
  const [stageCompletionRates, setStageCompletionRates] = useState<StageCompletionRate[]>([]);
  const [dropOffPoints, setDropOffPoints] = useState<DropOffPoint[]>([]);
  const [templateAnalytics, setTemplateAnalytics] = useState<TemplateAnalytics[]>([]);
  const [milestoneAnalytics, setMilestoneAnalytics] = useState<MilestoneAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track stage progress
  const trackStageStart = async (stageName: string, strategyId?: string) => {
    if (!user) return;

    try {
      const key = `stage_start:${user.id}:${stageName}:${strategyId || 'none'}`;
      if (isPending(key)) return;
      markPending(key, 1000);

      await supabase.from('business_progress_stages').insert({
        user_id: user.id,
        strategy_id: strategyId,
        stage_name: stageName,
        started_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to track stage start:', error);
    }
  };

  const trackStageCompletion = async (stageName: string, timeSpentSeconds: number, fieldsCompleted: number, totalFields: number) => {
    if (!user) return;

    try {
      const key = `stage_complete:${user.id}:${stageName}`;
      if (isPending(key)) return;
      markPending(key, 1000);

      // Update the most recent stage record for this user and stage
      const { data: stageRecord } = await supabase
        .from('business_progress_stages')
        .select('id')
        .eq('user_id', user.id)
        .eq('stage_name', stageName)
        .is('completed_at', null)
        .order('started_at', { ascending: false })
        .limit(1)
        .single();

      if (stageRecord) {
        await supabase
          .from('business_progress_stages')
          .update({
            completed_at: new Date().toISOString(),
            time_spent_seconds: timeSpentSeconds,
            form_fields_completed: fieldsCompleted,
            total_form_fields: totalFields
          })
          .eq('id', stageRecord.id);
      }
    } catch (error) {
      console.error('Failed to track stage completion:', error);
    }
  };

  // Track template usage
  const trackTemplateSelection = async (templateId: string, templateName: string) => {
    if (!user) return;

    try {
      await supabase.from('template_usage_analytics').insert({
        user_id: user.id,
        template_id: templateId,
        template_name: templateName,
        selected_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to track template selection:', error);
    }
  };

  const trackTemplateCompletion = async (templateId: string, completionPercentage: number, timeToCompleteMinutes: number) => {
    if (!user) return;

    try {
      // Update the most recent template record for this user
      const { data: templateRecord } = await supabase
        .from('template_usage_analytics')
        .select('id')
        .eq('user_id', user.id)
        .eq('template_id', templateId)
        .is('completed_at', null)
        .order('selected_at', { ascending: false })
        .limit(1)
        .single();

      if (templateRecord) {
        await supabase
          .from('template_usage_analytics')
          .update({
            completed_at: new Date().toISOString(),
            completion_percentage: completionPercentage,
            time_to_complete_minutes: timeToCompleteMinutes,
            conversion_type: completionPercentage >= 90 ? 'completed' : 'partial'
          })
          .eq('id', templateRecord.id);
      }
    } catch (error) {
      console.error('Failed to track template completion:', error);
    }
  };

  // Track user journey
  const trackUserJourney = async (pagePath: string, actionType: string, actionData: any = {}, sessionId: string) => {
    if (!user) return;

    try {
      const key = `journey:${user.id}:${sessionId}:${pagePath}:${actionType}:${JSON.stringify(actionData)}`;
      if (isPending(key)) return;
      markPending(key, 1000);

      await supabase.from('user_journey_analytics').insert({
        user_id: user.id,
        session_id: sessionId,
        page_path: pagePath,
        action_type: actionType,
        action_data: actionData,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        referrer: document.referrer
      });
    } catch (error) {
      console.error('Failed to track user journey:', error);
    }
  };

  // Track milestone analytics
  const trackMilestone = async (milestoneTitle: string, milestoneCategory: string, targetDate?: Date, businessId?: string, businessStage?: string) => {
    if (!user) return;

    try {
      await supabase.from('milestone_completion_analytics').insert({
        user_id: user.id,
        business_id: businessId,
        milestone_title: milestoneTitle,
        milestone_category: milestoneCategory,
        target_date: targetDate?.toISOString().split('T')[0],
        business_stage: businessStage,
        status: 'planned'
      });
    } catch (error) {
      console.error('Failed to track milestone:', error);
    }
  };

  const markMilestoneCompleted = async (milestoneTitle: string) => {
    if (!user) return;

    try {
      const completedAt = new Date();
      const { data: milestone } = await supabase
        .from('milestone_completion_analytics')
        .select('created_at')
        .eq('user_id', user.id)
        .eq('milestone_title', milestoneTitle)
        .eq('status', 'planned')
        .single();

      if (milestone) {
        const daysToComplete = Math.ceil(
          (completedAt.getTime() - new Date(milestone.created_at).getTime()) / (1000 * 60 * 60 * 24)
        );

        await supabase
          .from('milestone_completion_analytics')
          .update({
            completed_at: completedAt.toISOString(),
            status: 'completed',
            days_to_complete: daysToComplete
          })
          .eq('user_id', user.id)
          .eq('milestone_title', milestoneTitle)
          .eq('status', 'planned');
      }
    } catch (error) {
      console.error('Failed to mark milestone completed:', error);
    }
  };

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return;

      try {
        setLoading(true);

        const { getCurrentHubIdFromStorage } = await import('@/lib/tenant');
        const hubId = getCurrentHubIdFromStorage();

        // Fetch stage completion rates (RPCs left as-is since signatures may vary)
        try {
          const { data: stageRates } = hubId ? await supabase.rpc('calculate_stage_completion_rates', { p_hub_id: hubId }) : await supabase.rpc('calculate_stage_completion_rates');
          setStageCompletionRates((stageRates as any) || []);
        } catch (e) {
          console.warn('calculate_stage_completion_rates RPC failed with hub param, falling back', e);
          const { data: stageRates } = await supabase.rpc('calculate_stage_completion_rates');
          setStageCompletionRates((stageRates as any) || []);
        }

        // Fetch drop-off points
        try {
          const { data: dropOffs } = hubId ? await supabase.rpc('analyze_drop_off_points', { p_hub_id: hubId }) : await supabase.rpc('analyze_drop_off_points');
          setDropOffPoints((dropOffs as any) || []);
        } catch (e) {
          console.warn('analyze_drop_off_points RPC failed with hub param, falling back', e);
          const { data: dropOffs } = await supabase.rpc('analyze_drop_off_points');
          setDropOffPoints((dropOffs as any) || []);
        }

        // Fetch template analytics with safe hub filter
        let templates: any[] | null = null;
        try {
          const q = supabase.from('template_usage_analytics').select('template_id, template_name, completion_percentage, time_to_complete_minutes, conversion_type');
          if (hubId) q.eq('hub_id', hubId);
          const res = await q;
          if (res.error) throw res.error;
          templates = res.data as any[];
        } catch (e: any) {
          const msg = String(e?.message || e?.error || '');
          if (msg.includes('column') && msg.includes('does not exist')) {
            // retry without hub filter
            const res = await supabase.from('template_usage_analytics').select('template_id, template_name, completion_percentage, time_to_complete_minutes, conversion_type');
            templates = res.data as any[];
          } else {
            console.error('Failed to load template analytics:', e);
            templates = [];
          }
        }

        const templateStats = templates?.reduce((acc: any, template) => {
          const existing = acc.find((t: any) => t.template_id === template.template_id);
          if (existing) {
            existing.total_selections++;
            if (template.conversion_type === 'completed') {
              existing.total_completions++;
              existing.total_time += template.time_to_complete_minutes || 0;
            }
          } else {
            acc.push({
              template_id: template.template_id,
              template_name: template.template_name,
              total_selections: 1,
              total_completions: template.conversion_type === 'completed' ? 1 : 0,
              total_time: template.time_to_complete_minutes || 0
            });
          }
          return acc;
        }, []);

        const templateAnalyticsData = templateStats?.map((t: any) => ({
          ...t,
          completion_rate: t.total_selections > 0 ? (t.total_completions / t.total_selections) * 100 : 0,
          avg_completion_time: t.total_completions > 0 ? t.total_time / t.total_completions : 0
        })) || [];

        setTemplateAnalytics(templateAnalyticsData);

        // Fetch milestone analytics (try hub-aware filter first)
        let milestones: any[] | null = null;
        try {
          const q = supabase.from('milestone_completion_analytics').select('*').eq('user_id', user.id);
          if (hubId) q.eq('hub_id', hubId);
          const res = await q;
          if (res.error) throw res.error;
          milestones = res.data as any[];
        } catch (e: any) {
          const msg = String(e?.message || e?.error || '');
          if (msg.includes('column') && msg.includes('does not exist')) {
            const res = await supabase.from('milestone_completion_analytics').select('*').eq('user_id', user.id);
            milestones = res.data as any[];
          } else {
            console.error('Failed to load milestones:', e);
            milestones = [];
          }
        }

        if (milestones) {
          const totalMilestones = milestones.length;
          const completed = milestones.filter(m => m.status === 'completed').length;
          const overdue = milestones.filter(m => 
            m.target_date && new Date(m.target_date) < new Date() && m.status !== 'completed'
          ).length;
          
          const avgCompletionTime = milestones
            .filter(m => m.days_to_complete)
            .reduce((sum, m) => sum + (m.days_to_complete || 0), 0) / Math.max(completed, 1);

          const milestonesByStage = milestones.reduce((acc: any, milestone) => {
            const stage = milestone.business_stage || 'unknown';
            const existing = acc.find((s: any) => s.business_stage === stage);
            if (existing) {
              existing.count++;
              if (milestone.status === 'completed') existing.completed++;
            } else {
              acc.push({
                business_stage: stage,
                count: 1,
                completed: milestone.status === 'completed' ? 1 : 0
              });
            }
            return acc;
          }, []).map((s: any) => ({
            ...s,
            completion_rate: s.count > 0 ? (s.completed / s.count) * 100 : 0
          }));

          setMilestoneAnalytics({
            total_milestones: totalMilestones,
            completed_milestones: completed,
            overdue_milestones: overdue,
            avg_completion_time: avgCompletionTime,
            milestones_by_stage: milestonesByStage
          });
        }

      } catch (err) {
        console.error('Error fetching business intelligence data:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user]);

  return {
    stageCompletionRates,
    dropOffPoints,
    templateAnalytics,
    milestoneAnalytics,
    loading,
    error,
    // Tracking functions
    trackStageStart,
    trackStageCompletion,
    trackTemplateSelection,
    trackTemplateCompletion,
    trackUserJourney,
    trackMilestone,
    markMilestoneCompleted
  };
};
