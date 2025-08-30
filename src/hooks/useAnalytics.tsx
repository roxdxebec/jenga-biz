import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useAnalytics = () => {
  const { user } = useAuth();

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

  return {
    trackActivity,
    trackPageView,
    trackAction,
    getGeographicInfo
  };
};