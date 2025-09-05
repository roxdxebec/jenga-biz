import { useState, useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

interface Strategy {
  id?: string;
  user_id?: string;
  template_id?: string;
  template_name?: string;
  business_name?: string;
  vision?: string;
  mission?: string;
  target_market?: string;
  revenue_model?: string;
  value_proposition?: string;
  key_partners?: string;
  marketing_approach?: string;
  operational_needs?: string;
  growth_goals?: string;
  language?: string;
  country?: string;
  currency?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface Milestone {
  id?: string;
  user_id?: string;
  strategy_id?: string;
  title: string;
  target_date?: string | null;
  status: string; // Allow any string from database, will cast when needed
  business_stage?: string; // Allow any string from database, will cast when needed
  created_at?: string;
  updated_at?: string;
}

export const useStrategy = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [currentStrategy, setCurrentStrategy] = useState<Strategy | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  // Load user's strategies
  const loadStrategies = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('strategies')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      setStrategies(data || []);
      
      // Set the most recent strategy as current if none is selected
      if (data && data.length > 0 && !currentStrategy) {
        setCurrentStrategy(data[0]);
      }
    } catch (error) {
      console.error('Error loading strategies:', error);
      toast({
        title: 'Error',
        description: 'Failed to load strategies',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto-save with debouncing
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const saveStrategy = async (strategyData: Partial<Strategy>, showToast = false) => {
    if (!user) return null;

    try {
      const dataToSave = {
        ...strategyData,
        user_id: user.id,
        updated_at: new Date().toISOString()
      };

      let result;
      
      if (currentStrategy?.id) {
        // Update existing strategy
        const { data, error } = await supabase
          .from('strategies')
          .update(dataToSave)
          .eq('id', currentStrategy.id)
          .eq('user_id', user.id)
          .select()
          .single();
          
        if (error) throw error;
        result = data;
        
        // Update local state
        setCurrentStrategy(result);
        setStrategies(prev => prev.map(s => s.id === result.id ? result : s));
      } else {
        // Create new strategy
        const { data, error } = await supabase
          .from('strategies')
          .insert([dataToSave])
          .select()
          .single();
          
        if (error) throw error;
        result = data;
        
        // Update local state
        setCurrentStrategy(result);
        setStrategies(prev => [result, ...prev]);
      }

      if (showToast) {
        toast({
          title: 'Strategy Saved',
          description: 'Your changes have been saved automatically.',
        });
      }

      return result;
    } catch (error) {
      console.error('Error saving strategy:', error);
      if (showToast) {
        toast({
          title: 'Error',
          description: 'Failed to save strategy',
          variant: 'destructive'
        });
      }
      return null;
    }
  };

  // Auto-save strategy with debouncing
  const autoSaveStrategy = async (strategyData: Partial<Strategy>) => {
    if (!user) return;

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Set new timeout for auto-save
    autoSaveTimeoutRef.current = setTimeout(() => {
      saveStrategy(strategyData, false); // Don't show toast for auto-save
    }, 1000); // 1 second debounce
  };

  // Load milestones for current strategy
  const loadMilestones = async (strategyId?: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .eq('user_id', user.id)
        .eq('strategy_id', strategyId || currentStrategy?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setMilestones(data || []);
    } catch (error) {
      console.error('Error loading milestones:', error);
    }
  };

  // Save milestone
  const saveMilestone = async (milestoneData: Partial<Milestone>) => {
    if (!user || !milestoneData.title) return null;

    try {
      const dataToSave = {
        title: milestoneData.title,
        user_id: user.id,
        strategy_id: currentStrategy?.id || null,
        target_date: milestoneData.target_date || null,
        status: milestoneData.status || 'not-started',
        business_stage: milestoneData.business_stage || 'ideation',
        updated_at: new Date().toISOString()
      };

      let result;
      
      if (milestoneData.id) {
        // Update existing milestone
        const { data, error } = await supabase
          .from('milestones')
          .update(dataToSave)
          .eq('id', milestoneData.id)
          .eq('user_id', user.id)
          .select()
          .single();
          
        if (error) throw error;
        result = data;
        
        // Update local state
        setMilestones(prev => prev.map(m => m.id === result?.id ? result : m));
      } else {
        // Create new milestone
        const { data, error } = await supabase
          .from('milestones')
          .insert([dataToSave])
          .select()
          .single();
          
        if (error) throw error;
        result = data;
        
        // Update local state
        setMilestones(prev => [result, ...prev]);
      }

      return result;
    } catch (error) {
      console.error('Error saving milestone:', error);
      toast({
        title: 'Error',
        description: 'Failed to save milestone',
        variant: 'destructive'
      });
      return null;
    }
  };

  // Delete milestone
  const deleteMilestone = async (milestoneId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('milestones')
        .delete()
        .eq('id', milestoneId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Update local state
      setMilestones(prev => prev.filter(m => m.id !== milestoneId));
      
      return true;
    } catch (error) {
      console.error('Error deleting milestone:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete milestone',
        variant: 'destructive'
      });
      return false;
    }
  };

  // Create strategy from template
  const createFromTemplate = async (template: any) => {
    console.log('=== CREATE FROM TEMPLATE DEBUG ===');
    console.log('User:', !!user);
    console.log('Template received:', template);
    
    if (!user) {
      console.log('No user for createFromTemplate');
      return null;
    }

    const strategyData = {
      template_id: template.id,
      template_name: template.name,
      business_name: template.name,
      vision: template.content?.vision || '',
      mission: template.content?.mission || '',
      target_market: template.content?.targetMarket || '',
      revenue_model: template.content?.revenueModel || '',
      value_proposition: template.content?.valueProposition || '',
      key_partners: template.content?.keyPartners || '',
      marketing_approach: template.content?.marketingApproach || '',
      operational_needs: template.content?.operationalNeeds || '',
      growth_goals: template.content?.growthGoals || '',
      language: 'en',
      country: 'KE',
      currency: 'KES'
    };

    console.log('Strategy data to save:', strategyData);
    const result = await saveStrategy(strategyData);
    console.log('Save strategy result:', result);
    return result;
  };

  // Load strategies when user changes
  useEffect(() => {
    if (user) {
      loadStrategies();
    } else {
      setStrategies([]);
      setCurrentStrategy(null);
      setMilestones([]);
    }
  }, [user]);

  // Load milestones when current strategy changes
  useEffect(() => {
    if (currentStrategy?.id) {
      loadMilestones(currentStrategy.id);
    } else {
      setMilestones([]);
    }
  }, [currentStrategy?.id]);

  return {
    loading,
    strategies,
    currentStrategy,
    milestones,
    setCurrentStrategy,
    loadStrategies,
    saveStrategy,
    autoSaveStrategy,
    loadMilestones,
    saveMilestone,
    deleteMilestone,
    createFromTemplate
  };
};