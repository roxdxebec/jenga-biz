import { supabase } from '@/integrations/supabase/client';

export async function saveMilestone(userId: string, strategyId: string, milestone: {
  id?: string;
  title: string;
  description?: string | null;
  target_date: string; // ISO date string expected
  status: 'pending' | 'in_progress' | 'completed' | string;
}) {
  if (!milestone.target_date) {
    throw new Error('Milestone must include a target_date');
  }
  if (!milestone.status) {
    milestone.status = 'pending';
  }

  const payload = {
    user_id: userId,
    strategy_id: strategyId,
    title: milestone.title,
    target_date: milestone.target_date,
    status: milestone.status,
  };

  if (milestone.id) {
    const { data, error } = await supabase
      .from('milestones')
      .update(payload)
      .eq('id', milestone.id)
      .select();
    return { data, error };
  } else {
    const { data, error } = await supabase
      .from('milestones')
      .insert(payload)
      .select();
    return { data, error };
  }
}