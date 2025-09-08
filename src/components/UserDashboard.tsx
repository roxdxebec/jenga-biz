
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Building2, 
  ArrowLeft, 
  Plus, 
  Calendar, 
  BarChart3, 
  Settings,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useStrategy } from '@/hooks/useStrategy';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface UserDashboardProps {
  onBackToHome: () => void;
  onNewStrategy: () => void;
  onViewStrategy: (strategy: any) => void;
  onEditProfile: () => void;
  onNavigateToFinancialTracker?: () => void;
  onNavigateToMilestones?: () => void;
}

interface UserProfile {
  id: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  organization_name?: string;
  profile_picture_url?: string;
  logo_url?: string;
  account_type: string;
  industry?: string;
  country?: string;
}

const UserDashboard = ({ onBackToHome, onNewStrategy, onViewStrategy, onEditProfile, onNavigateToFinancialTracker, onNavigateToMilestones }: UserDashboardProps) => {
  const { user, signOut } = useAuth();
  const { strategies, loading, loadStrategies } = useStrategy();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserProfile();
      loadStrategies();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const getUserDisplayName = () => {
    if (!profile) return 'User';
    
    if (profile.account_type === 'organization') {
      return profile.organization_name || 'Organization';
    } else {
      return profile.full_name || `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'User';
    }
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getProfileImage = () => {
    if (profile?.account_type === 'organization') {
      return profile.logo_url;
    } else {
      return profile?.profile_picture_url;
    }
  };

  const getAccountTypeDisplay = () => {
    if (profile?.account_type === 'organization') {
      return 'Organization';
    } else {
      return 'Entrepreneur';
    }
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <div className="bg-white border-b border-orange-200 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto">
          {/* Top Row - Back button and Actions */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                console.log('Back to Home clicked');
                onBackToHome();
              }}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  console.log('Settings clicked');
                  onEditProfile();
                }}
                className="border-orange-200 text-orange-700 hover:bg-orange-50 text-xs sm:text-sm"
              >
                <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Settings
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  console.log('Sign out clicked');
                  await signOut();
                  window.location.href = '/auth';
                }}
                className="border-gray-200 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm"
              >
                Sign Out
              </Button>
            </div>
          </div>

          {/* Profile Information Row */}
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0">
              <AvatarImage src={getProfileImage()} alt={getUserDisplayName()} />
              <AvatarFallback className="bg-orange-100 text-orange-700 text-lg">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 truncate">
                {getUserDisplayName()}
              </h1>
              
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="text-xs sm:text-sm">
                  {getAccountTypeDisplay()}
                </Badge>
                {profile?.industry && (
                  <Badge variant="outline" className="text-xs sm:text-sm">
                    {profile.industry}
                  </Badge>
                )}
                {profile?.country && (
                  <Badge variant="outline" className="text-xs sm:text-sm">
                    {profile.country}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Check if user has no data in all sections */}
        {strategies.length === 0 && (
          <Card className="border-orange-200 mb-8">
            <CardContent className="p-8 text-center">
              <div className="mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="w-10 h-10 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Let's Get Started!</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Create your business strategy, set milestones, and track your financial progress to achieve your entrepreneurial goals.
                </p>
                <Button
                  onClick={onBackToHome}
                  className="bg-orange-600 hover:bg-orange-700"
                  size="lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Start Your Journey
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Strategies Overview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Strategies</h2>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading strategies...</p>
            </div>
          ) : strategies.length === 0 ? (
            <Card className="border-gray-200">
              <CardContent className="p-8 text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Strategies Yet</h3>
                  <p className="text-gray-600 mb-6">
                    Create your first business strategy to get started with planning your venture.
                  </p>
                  <Button
                    onClick={onBackToHome}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Strategy
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {strategies.map((strategy) => (
                <Card key={strategy.id} className="border-orange-200 hover:border-orange-300 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg text-gray-900 line-clamp-1">
                          {strategy.business_name || strategy.template_name || 'Untitled Strategy'}
                        </CardTitle>
                        {strategy.template_name && (
                          <Badge variant="outline" className="mt-2 text-xs">
                            {strategy.template_name}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {strategy.vision && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {strategy.vision}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>
                        Updated {formatDistanceToNow(new Date(strategy.updated_at || strategy.created_at || ''), { addSuffix: true })}
                      </span>
                      <div className="flex items-center gap-1">
                        {strategy.language && (
                          <Badge variant="secondary" className="text-xs">
                            {strategy.language?.toUpperCase()}
                          </Badge>
                        )}
                        {strategy.country && (
                          <Badge variant="secondary" className="text-xs">
                            {strategy.country}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewStrategy(strategy)}
                        className="flex-1"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewStrategy(strategy)}
                        className="flex-1"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Milestones Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Milestones</h2>
          </div>
          
          <Card className="border-blue-200">
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">No Milestones Yet</h3>
                <p className="text-gray-600 mb-4">
                  Set and track important business milestones to measure your progress.
                </p>
                <Button
                  onClick={() => onNavigateToMilestones?.()}
                  variant="outline"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Add Milestones
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Data Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Financial Data</h2>
          </div>
          
          <Card className="border-green-200">
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">No Financial Data Yet</h3>
                <p className="text-gray-600 mb-4">
                  Track your revenue and expenses to monitor your business health.
                </p>
                <Button
                  onClick={() => onNavigateToFinancialTracker?.()}
                  variant="outline"
                  className="border-green-200 text-green-700 hover:bg-green-50"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Add Financial Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card 
              className="border-orange-200 hover:border-orange-300 cursor-pointer transition-colors"
              onClick={onBackToHome}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Plus className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">New Strategy</h3>
                    <p className="text-sm text-gray-600">Choose template or start from scratch</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="border-blue-200 hover:border-blue-300 cursor-pointer transition-colors"
              onClick={() => onNavigateToMilestones?.()}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Track Milestones</h3>
                    <p className="text-sm text-gray-600">Manage your business goals</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="border-green-200 hover:border-green-300 cursor-pointer transition-colors"
              onClick={() => onNavigateToFinancialTracker?.()}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Financial Tracker</h3>
                    <p className="text-sm text-gray-600">Monitor your finances</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
