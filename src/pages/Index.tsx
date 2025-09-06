import { useState, useEffect } from 'react';
import Home from '@/pages/Home';
import UserDashboard from '@/components/UserDashboard';
import SaaSFeatures from '@/components/SaaSFeatures';
import { TemplateData } from '@/data/templateData';
import { EnhancedAuthDialog } from '@/components/auth/EnhancedAuthDialog';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { useAuth } from '@/hooks/useAuth';
import { useStrategy } from '@/hooks/useStrategy';
import ProfileSetup from '@/components/ProfileSetup';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { LogOut, Home as HomeIcon } from 'lucide-react';
import FinancialTracker from '@/components/FinancialTracker';
import BusinessMilestonesSection from '@/components/BusinessMilestonesSection';
import DropdownTemplateSelector from '@/components/DropdownTemplateSelector';
import StrategyBuilder from '@/components/StrategyBuilder';

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const { 
    strategies, 
    currentStrategy, 
    saveStrategy, 
    autoSaveStrategy,
    createFromTemplate, 
    setCurrentStrategy 
  } = useStrategy();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateData | null>(null);
  const [language, setLanguage] = useState('en');
  const [country, setCountry] = useState('KE');
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);
  const [profileCheckComplete, setProfileCheckComplete] = useState(false);

  // Check if user has admin role and needs profile setup
  useEffect(() => {
    if (user) {
      checkUserRole();
      checkProfileSetup();
    } else {
      setIsAdmin(null);
      setNeedsProfileSetup(false);
      setProfileCheckComplete(false);
    }
  }, [user]);

  const checkUserRole = async () => {
    if (!user) {
      setIsAdmin(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .in('role', ['admin', 'super_admin', 'hub_manager']);

      if (error) throw error;
      
      const adminRole = data.find(role => ['admin', 'super_admin', 'hub_manager'].includes(role.role));
      setIsAdmin(!!adminRole);
    } catch (error) {
      console.error('Error checking user role:', error);
      setIsAdmin(false);
    }
  };

  const checkProfileSetup = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_profile_complete, account_type')
        .eq('id', user.id)
        .single();

      if (error) {
        setNeedsProfileSetup(true);
      } else {
        setNeedsProfileSetup(!data.is_profile_complete);
      }
    } catch (error) {
      console.error('Error checking profile setup:', error);
      setNeedsProfileSetup(true);
    } finally {
      setProfileCheckComplete(true);
    }
  };

  // Show auth dialog if user is not authenticated
  useEffect(() => {
    if (!loading && !user) {
      setShowAuthDialog(true);
    }
  }, [user, loading]);

  const handleAuthDialogChange = (open: boolean) => {
    if (user) {
      setShowAuthDialog(open);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      
      // Clear local state
      setCurrentStrategy(null);
      setSelectedTemplate(null);
      setCurrentView('home');
      setNeedsProfileSetup(false);
      setProfileCheckComplete(false);
      setIsAdmin(null);
      
      // Navigate to auth page
      window.location.href = '/auth';
      
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleTemplateSelect = (template: TemplateData) => {
    setSelectedTemplate(template);
    setCurrentView('strategyBuilder');
  };

  const handleStartFromScratch = () => {
    setSelectedTemplate(null);
    setCurrentView('strategyBuilder');
  };

  const handleProfileSetupComplete = () => {
    setNeedsProfileSetup(false);
    setCurrentView('dashboard');
  };

  // Loading state
  if (loading || (user && !profileCheckComplete)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Auth dialog for non-authenticated users
  if (!user) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Jenga Biz Africa</h1>
            <p className="text-xl text-gray-600 mb-8">Build Your Business Strategy for the African Market</p>
            <Button onClick={() => setShowAuthDialog(true)} size="lg">
              Get Started
            </Button>
          </div>
        </div>
        <EnhancedAuthDialog open={showAuthDialog} onOpenChange={handleAuthDialogChange} />
      </>
    );
  }

  // Profile setup required
  if (needsProfileSetup) {
    return (
      <ProfileSetup 
        onComplete={handleProfileSetupComplete}
      />
    );
  }

  // Show admin dashboard for admin users
  if (user && isAdmin === true) {
    return <AdminDashboard />;
  }

  // Show Financial Tracker
  if (user && currentView === 'financialTracker') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4 flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900">Financial Tracker</h1>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentView('dashboard')}
                >
                <HomeIcon className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
        <FinancialTracker 
          language={language}
          currency="KES"
          currencySymbol="KSh"
        />
      </div>
    );
  }

  // Show Milestones
  if (user && currentView === 'milestones') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4 flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900">Business Milestones</h1>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            console.log('Back to Home clicked');
            console.log('Navigating to home');
            setCurrentView('dashboard');
          }}
        >
          <HomeIcon className="w-4 h-4 mr-2" />
          Dashboard
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          className="border-gray-200 text-gray-700 hover:bg-gray-50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BusinessMilestonesSection 
            language={language}
            isPro={true}
          />
        </div>
      </div>
    );
  }

  // Show SaaS features for organization account types
  if (user && currentView === 'saas') {
    return <SaaSFeatures onSignOut={handleSignOut} />;
  }

  // Template selection
  if (currentView === 'templates') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4 flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900">Choose Your Template</h1>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentView('dashboard')}
                >
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DropdownTemplateSelector
          onTemplateSelect={handleTemplateSelectFromHome}
          onStartFromScratch={() => {
            setSelectedTemplate(null);
            setStrategyData(null);
            setCurrentView('strategyBuilder');
          }}
          onBack={() => setCurrentView('dashboard')}
          language={language}
        />
      </div>
    );
  }

  // Strategy Builder
  if (currentView === 'strategyBuilder') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4 flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900">Strategy Builder</h1>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentView('dashboard')}
                >
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <StrategyBuilder
            template={strategyData || selectedTemplate}
            onStrategyChange={handleStrategyChangeWithSave}
            onShowSummary={() => {}}
            onBack={() => setCurrentView('dashboard')}
            onHome={() => setCurrentView('dashboard')}
            language={language}
            onLanguageChange={setLanguage}
            country={country}
            onCountryChange={setCountry}
            currency="KES"
            currencySymbol="KSh"
          />
        </div>
      </div>
    );
  }

  // Show Home page with 4 cards when currentView is 'home'
  if (currentView === 'home') {
    return (
      <Home 
        language={language}
        onTemplateSelect={handleTemplateSelect}
        onStartFromScratch={handleStartFromScratch}
      />
    );
  }

  // Default: User Dashboard for logged in users
  return (
    <UserDashboard
      onBackToHome={() => setCurrentView('home')}
      onNewStrategy={() => setCurrentView('templates')}
      onViewStrategy={() => {}}
      onEditProfile={() => setCurrentView('profile')}
      onNavigateToFinancialTracker={() => setCurrentView('financialTracker')}
      onNavigateToMilestones={() => setCurrentView('milestones')}
    />
  );
};

export default Index;