import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useBusinessIntelligence } from './useBusinessIntelligence';

export const useAnalytics = () => {
  const { user } = useAuth();
  const { 
    trackTemplateSelection, 
    trackTemplateCompletion, 
    trackUserJourney, 
    trackStageStart, 
    trackStageCompletion,
    trackMilestone,
    markMilestoneCompleted
  } = useBusinessIntelligence();

  // Track user activity
  const trackActivity = async (activityType: string, activityData: any = {}, geo?: { country?: string, region?: string, city?: string }) => {
    if (!user) return;

    try {
      await supabase.from('user_activities').insert({
        user_id: user.id,
        activity_type: activityType,
        activity_data: activityData,
        country_code: geo?.country || 'Unknown',
        region: geo?.region,
        city: geo?.city,
        user_agent: navigator.userAgent
      });
    } catch (error) {
      console.error('Failed to track activity:', error);
    }
  };

  // Track page views
  const trackPageView = (page: string, geo?: any) => {
    trackActivity('page_view', { page }, geo);
  };

  // Track user actions
  const trackAction = (action: string, data: any = {}, geo?: any) => {
    trackActivity('action_taken', { action, ...data }, geo);
  };

  // Get user's geographic info from IP
  const getGeographicInfo = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const geoData = await response.json();
      return {
        country: geoData.country_code,
        region: geoData.region,
        city: geoData.city
      };
    } catch (error) {
      console.error('Failed to get geographic info:', error);
      return { country: 'Unknown', region: null, city: null };
    }
  };

  // Track login event
  useEffect(() => {
    const trackLogin = async () => {
      if (user) {
        const geo = await getGeographicInfo();
        await trackActivity('login', {}, geo);
      }
    };

    trackLogin();
  }, [user]);

  // Generate session ID for user journey tracking
  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Enhanced tracking functions
  const trackTemplateUsage = async (templateId: string, templateName: string, action: 'selected' | 'completed', additionalData: any = {}) => {
    if (action === 'selected') {
      await trackTemplateSelection(templateId, templateName);
    } else if (action === 'completed') {
      const { completionPercentage = 100, timeToCompleteMinutes = 0 } = additionalData;
      await trackTemplateCompletion(templateId, completionPercentage, timeToCompleteMinutes);
    }
    
    // Also track in regular analytics
    await trackActivity(`template_${action}`, { templateId, templateName, ...additionalData });
  };

  const trackStrategyStage = async (stageName: string, action: 'started' | 'completed', additionalData: any = {}) => {
    if (action === 'started') {
      await trackStageStart(stageName, additionalData.strategyId);
    } else if (action === 'completed') {
      const { timeSpentSeconds = 0, fieldsCompleted = 0, totalFields = 0 } = additionalData;
      await trackStageCompletion(stageName, timeSpentSeconds, fieldsCompleted, totalFields);
    }
    
    // Also track in regular analytics
    await trackActivity(`stage_${action}`, { stageName, ...additionalData });
  };

  const trackBusinessMilestone = async (action: 'created' | 'completed', milestoneData: any) => {
    if (action === 'created') {
      const { title, category, targetDate, businessId, businessStage } = milestoneData;
      await trackMilestone(title, category, targetDate, businessId, businessStage);
    } else if (action === 'completed') {
      await markMilestoneCompleted(milestoneData.title);
    }
    
    // Also track in regular analytics
    await trackActivity(`milestone_${action}`, milestoneData);
  };

  const trackJourney = async (pagePath: string, actionType: string, actionData: any = {}) => {
    const sessionId = sessionStorage.getItem('userSessionId') || generateSessionId();
    sessionStorage.setItem('userSessionId', sessionId);
    
    await trackUserJourney(pagePath, actionType, actionData, sessionId);
    
    // Also track as regular activity
    await trackActivity('user_journey', { pagePath, actionType, ...actionData });
  };

  return {
    trackActivity,
    trackPageView,
    trackAction,
    getGeographicInfo,
    // Enhanced BI tracking functions
    trackTemplateUsage,
    trackStrategyStage,
    trackBusinessMilestone,
    trackJourney,
    generateSessionId
  };
};