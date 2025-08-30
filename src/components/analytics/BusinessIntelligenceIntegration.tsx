import { useEffect } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useAuth } from '@/hooks/useAuth';

interface BusinessIntelligenceIntegrationProps {
  children: React.ReactNode;
}

export const BusinessIntelligenceIntegration = ({ children }: BusinessIntelligenceIntegrationProps) => {
  const { user } = useAuth();
  const { trackJourney, generateSessionId } = useAnalytics();

  useEffect(() => {
    if (!user) return;

    // Initialize session tracking
    const sessionId = sessionStorage.getItem('userSessionId') || generateSessionId();
    sessionStorage.setItem('userSessionId', sessionId);

    // Track page navigation
    const handlePageChange = () => {
      const currentPath = window.location.pathname;
      trackJourney(currentPath, 'page_view', {
        timestamp: new Date().toISOString(),
        sessionId: sessionId,
        userAgent: navigator.userAgent
      });
    };

    // Track initial page load
    handlePageChange();

    // Track user engagement on page
    let pageStartTime = Date.now();
    let isUserActive = true;
    let engagementTimer: NodeJS.Timeout;

    const trackEngagement = () => {
      if (isUserActive) {
        const timeOnPage = Math.floor((Date.now() - pageStartTime) / 1000);
        trackJourney(window.location.pathname, 'engagement', {
          timeOnPage,
          sessionId,
          active: true
        });
      }
    };

    // Track user activity
    const handleUserActivity = () => {
      isUserActive = true;
      clearTimeout(engagementTimer);
      engagementTimer = setTimeout(() => {
        isUserActive = false;
      }, 30000); // Consider user inactive after 30 seconds
    };

    // Track when user leaves page
    const handleBeforeUnload = () => {
      const timeOnPage = Math.floor((Date.now() - pageStartTime) / 1000);
      trackJourney(window.location.pathname, 'exit', {
        timeOnPage,
        sessionId,
        exitTime: new Date().toISOString()
      });
    };

    // Set up event listeners
    document.addEventListener('mousemove', handleUserActivity);
    document.addEventListener('keypress', handleUserActivity);
    document.addEventListener('scroll', handleUserActivity);
    document.addEventListener('click', handleUserActivity);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Track engagement every minute
    const engagementInterval = setInterval(trackEngagement, 60000);

    return () => {
      clearInterval(engagementInterval);
      clearTimeout(engagementTimer);
      document.removeEventListener('mousemove', handleUserActivity);
      document.removeEventListener('keypress', handleUserActivity);
      document.removeEventListener('scroll', handleUserActivity);
      document.removeEventListener('click', handleUserActivity);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Final engagement tracking
      const timeOnPage = Math.floor((Date.now() - pageStartTime) / 1000);
      trackJourney(window.location.pathname, 'exit', {
        timeOnPage,
        sessionId,
        exitTime: new Date().toISOString()
      });
    };
  }, [user, trackJourney, generateSessionId]);

  return <>{children}</>;
};