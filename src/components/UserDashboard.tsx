
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Trash2,
  Download,
  Share2,
  FileDown,
  Target,
  DollarSign,
  MoreVertical
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { useStrategy } from '@/hooks/useStrategy';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { generateShareText, useShareActions } from '@/lib/shareUtils';
import ReportModal from './ReportModal';

interface UserDashboardProps {
  // No props needed - using React Router navigation
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

const UserDashboard = ({ }: UserDashboardProps) => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  console.log('🔍 UserDashboard - Component rendering v2 (no-onboarding)', user?.email, 'authLoading:', authLoading);
  
  // Import useStrategy hook
  const { strategies, loading, loadStrategies, milestones, loadMilestones } = useStrategy();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [allMilestones, setAllMilestones] = useState<any[]>([]);
  const [loadingMilestones, setLoadingMilestones] = useState(true);
  const [financialData, setFinancialData] = useState<any>({ totalRevenue: 0, totalExpenses: 0, recentTransactions: [] });
  const [loadingFinancial, setLoadingFinancial] = useState(true);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportMode, setReportMode] = useState<'download' | 'share'>('download');

  // Navigation handlers using React Router
  const handleBackToHome = () => navigate('/');
  const handleNewStrategy = () => navigate('/templates');
  const handleViewStrategy = (strategy: any) => {
    console.log('🔍 Dashboard - View strategy clicked, strategy.id:', strategy.id);
    navigate(`/strategy?id=${strategy.id}`);
  };
  const handleEditProfile = () => navigate('/profile');

  // Delete strategy handler
  const handleDeleteStrategy = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this strategy?");
    if (!confirmed) return;

    const { error } = await supabase
      .from('strategies')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting strategy:", error);
      toast({
        title: "Error",
        description: "Failed to delete strategy. Please try again.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Strategy deleted successfully.",
      });
      // Refresh strategies after delete
      loadStrategies();
    }
  };

  // Navigation to specific strategy tabs
  const handleUpdateMilestones = (strategyId: string) => {
    navigate(`/strategy?id=${strategyId}&tab=milestones`);
  };

  const handleUpdateFinancials = (strategyId: string) => {
    navigate(`/strategy?id=${strategyId}&tab=financials`);
  };

  // Report modal handlers
  const handleDownloadReport = () => {
    setReportMode('download');
    setReportModalOpen(true);
  };

  const handleShareReport = () => {
    setReportMode('share');
    setReportModalOpen(true);
  };

  const handleReportConfirm = (options: { type: string; period: string }) => {
    if (reportMode === 'download') {
      if (options.type === 'financials') {
        handleComprehensiveDownload('milestones'); // Use existing logic for now
      } else {
        handleComprehensiveDownload(options.type as 'full' | 'strategy' | 'milestones');
      }
    } else {
      handleComprehensiveShare();
    }
  };

  useEffect(() => {
    console.log('🔍 UserDashboard - useEffect triggered, user:', user?.email);
    if (user) {
      console.log('🔍 UserDashboard - User found, loading profile and data...');
      loadUserProfile();
      loadStrategies();
      loadUserMilestones();
      loadUserFinancialData();
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

  const loadUserMilestones = async () => {
    if (!user) return;

    try {
      setLoadingMilestones(true);
      console.log('Loading milestones for user:', user.id);
      
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log('Loaded milestones:', data);
      setAllMilestones(data || []);
    } catch (error) {
      console.error('Error loading user milestones:', error);
    } finally {
      setLoadingMilestones(false);
    }
  };

  const loadUserFinancialData = async () => {
    if (!user) return;

    try {
      setLoadingFinancial(true);
      console.log('Loading financial data for user:', user.id);
      
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('transaction_date', { ascending: false });

      if (error) throw error;
      
      console.log('Loaded financial transactions:', data);
      
      const totalRevenue = data?.filter(t => t.transaction_type === 'income').reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      const totalExpenses = data?.filter(t => t.transaction_type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      const recentTransactions = data?.slice(0, 5) || [];
      
      setFinancialData({
        totalRevenue,
        totalExpenses,
        netProfit: totalRevenue - totalExpenses,
        recentTransactions
      });
    } catch (error) {
      console.error('Error loading financial data:', error);
    } finally {
      setLoadingFinancial(false);
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

  const handleComprehensiveDownload = (type: 'full' | 'strategy' | 'milestones') => {
    const timestamp = new Date().toISOString().split('T')[0];
    let content = '';
    let filename = '';

    if (type === 'full') {
      filename = `jenga-biz-full-report-${timestamp}.txt`;
      content = generateFullReport();
    } else if (type === 'strategy') {
      filename = `jenga-biz-strategies-${timestamp}.txt`;
      content = generateStrategyReport();
    } else if (type === 'milestones') {
      filename = `jenga-biz-milestones-${timestamp}.txt`;
      content = generateMilestonesReport();
    }

    // Create and download file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: 'Report Downloaded',
      description: `${filename} downloaded successfully.`,
    });
  };

  const shareActions = useShareActions();

  const handleComprehensiveShare = () => {
    const shareText = generateFullReport();
    shareActions.handleCopyText(shareText);
  };

  const generateFullReport = () => {
    const userName = getUserDisplayName();
    const timestamp = new Date().toLocaleDateString();
    
    let report = `JENGA BIZ AFRICA - COMPREHENSIVE BUSINESS REPORT\n`;
    report += `Generated for: ${userName}\n`;
    report += `Date: ${timestamp}\n`;
    report += `${'='.repeat(60)}\n\n`;

    // Add strategies section
    report += `BUSINESS STRATEGIES (${strategies.length})\n`;
    report += `${'-'.repeat(30)}\n`;
    if (strategies.length > 0) {
      strategies.forEach((strategy, index) => {
        report += `${index + 1}. ${strategy.business_name || 'Untitled Strategy'}\n`;
        if (strategy.vision) report += `   Vision: ${strategy.vision}\n`;
        if (strategy.mission) report += `   Mission: ${strategy.mission}\n`;
        if (strategy.target_market) report += `   Target Market: ${strategy.target_market}\n`;
        if (strategy.revenue_model) report += `   Revenue Model: ${strategy.revenue_model}\n`;
        report += `   Updated: ${formatDistanceToNow(new Date(strategy.updated_at || strategy.created_at), { addSuffix: true })}\n\n`;
      });
    } else {
      report += `No strategies created yet.\n\n`;
    }

    // Add milestones section
    report += `BUSINESS MILESTONES (${allMilestones.length})\n`;
    report += `${'-'.repeat(30)}\n`;
    if (allMilestones.length > 0) {
      allMilestones.forEach((milestone, index) => {
        report += `${index + 1}. ${milestone.title}\n`;
        report += `   Status: ${milestone.status === 'not-started' ? 'Not Started' : 
                      milestone.status === 'in-progress' ? 'In Progress' : 
                      milestone.status === 'complete' ? 'Complete' : 'Overdue'}\n`;
        if (milestone.target_date) {
          report += `   Target Date: ${new Date(milestone.target_date).toLocaleDateString()}\n`;
        }
        report += `   Created: ${formatDistanceToNow(new Date(milestone.created_at), { addSuffix: true })}\n\n`;
      });
    } else {
      report += `No milestones created yet.\n\n`;
    }

    // Add financial section
    report += `FINANCIAL SUMMARY\n`;
    report += `${'-'.repeat(30)}\n`;
    report += `Total Revenue: KSh ${financialData.totalRevenue.toLocaleString()}\n`;
    report += `Total Expenses: KSh ${financialData.totalExpenses.toLocaleString()}\n`;
    report += `Net Profit: KSh ${financialData.netProfit.toLocaleString()}\n`;
    report += `Recent Transactions: ${financialData.recentTransactions.length}\n\n`;

    if (financialData.recentTransactions.length > 0) {
      report += `RECENT TRANSACTIONS (Last 5)\n`;
      report += `${'-'.repeat(30)}\n`;
      financialData.recentTransactions.forEach((transaction, index) => {
        report += `${index + 1}. ${transaction.description}\n`;
        report += `   Type: ${transaction.transaction_type}\n`;
        report += `   Amount: KSh ${Number(transaction.amount).toLocaleString()}\n`;
        report += `   Category: ${transaction.category}\n`;
        report += `   Date: ${new Date(transaction.transaction_date).toLocaleDateString()}\n\n`;
      });
    }

    report += `\n${'='.repeat(60)}\n`;
    report += `This report was generated by Jenga Biz Africa\n`;
    report += `Empowering African Entrepreneurs ✨\n`;

    return report;
  };

  const generateStrategyReport = () => {
    let report = `JENGA BIZ AFRICA - BUSINESS STRATEGIES REPORT\n`;
    report += `Generated: ${new Date().toLocaleDateString()}\n`;
    report += `${'='.repeat(50)}\n\n`;

    if (strategies.length > 0) {
      strategies.forEach((strategy, index) => {
        report += `STRATEGY ${index + 1}: ${strategy.business_name || 'Untitled'}\n`;
        report += `${'-'.repeat(40)}\n`;
        if (strategy.vision) report += `Vision: ${strategy.vision}\n\n`;
        if (strategy.mission) report += `Mission: ${strategy.mission}\n\n`;
        if (strategy.target_market) report += `Target Market: ${strategy.target_market}\n\n`;
        if (strategy.value_proposition) report += `Value Proposition: ${strategy.value_proposition}\n\n`;
        if (strategy.revenue_model) report += `Revenue Model: ${strategy.revenue_model}\n\n`;
        if (strategy.key_partners) report += `Key Partners: ${strategy.key_partners}\n\n`;
        if (strategy.marketing_approach) report += `Marketing Approach: ${strategy.marketing_approach}\n\n`;
        if (strategy.operational_needs) report += `Operational Needs: ${strategy.operational_needs}\n\n`;
        if (strategy.growth_goals) report += `Growth Goals: ${strategy.growth_goals}\n\n`;
        report += `Created: ${formatDistanceToNow(new Date(strategy.created_at), { addSuffix: true })}\n`;
        report += `Updated: ${formatDistanceToNow(new Date(strategy.updated_at), { addSuffix: true })}\n\n`;
        report += `${'='.repeat(50)}\n\n`;
      });
    } else {
      report += `No strategies found. Start creating your business strategy today!\n\n`;
    }

    report += `Generated with Jenga Biz Africa ✨\n`;
    return report;
  };

  const generateMilestonesReport = () => {
    let report = `JENGA BIZ AFRICA - BUSINESS MILESTONES REPORT\n`;
    report += `Generated: ${new Date().toLocaleDateString()}\n`;
    report += `${'='.repeat(50)}\n\n`;

    if (allMilestones.length > 0) {
      const groupedMilestones = {
        'not-started': allMilestones.filter(m => m.status === 'not-started'),
        'in-progress': allMilestones.filter(m => m.status === 'in-progress'), 
        'complete': allMilestones.filter(m => m.status === 'complete'),
        'overdue': allMilestones.filter(m => m.status === 'overdue')
      };

      Object.entries(groupedMilestones).forEach(([status, milestones]) => {
        if (milestones.length > 0) {
          report += `${status.toUpperCase().replace('-', ' ')} MILESTONES (${milestones.length})\n`;
          report += `${'-'.repeat(40)}\n`;
          milestones.forEach((milestone, index) => {
            report += `${index + 1}. ${milestone.title}\n`;
            if (milestone.target_date) {
              report += `   Target: ${new Date(milestone.target_date).toLocaleDateString()}\n`;
            }
            report += `   Stage: ${milestone.business_stage || 'Not specified'}\n`;
            report += `   Created: ${formatDistanceToNow(new Date(milestone.created_at), { addSuffix: true })}\n\n`;
          });
          report += `\n`;
        }
      });

      report += `SUMMARY:\n`;
      report += `Total Milestones: ${allMilestones.length}\n`;
      report += `Completed: ${groupedMilestones.complete.length}\n`;
      report += `In Progress: ${groupedMilestones['in-progress'].length}\n`;
      report += `Not Started: ${groupedMilestones['not-started'].length}\n`;
      report += `Overdue: ${groupedMilestones.overdue.length}\n\n`;
      
      const completionRate = allMilestones.length > 0 ? 
        Math.round((groupedMilestones.complete.length / allMilestones.length) * 100) : 0;
      report += `Completion Rate: ${completionRate}%\n\n`;
    } else {
      report += `No milestones found. Start setting business milestones to track your progress!\n\n`;
    }

    report += `Generated with Jenga Biz Africa ✨\n`;
    return report;
  };

  if (authLoading || loadingProfile) {
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
                handleBackToHome();
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
                  handleEditProfile();
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
                  try {
                    await signOut();
                    navigate('/auth');
                  } catch (error) {
                    console.error('Sign out error:', error);
                    // Force navigation even if signOut fails
                    window.location.href = '/auth';
                  }
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
            null
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {strategies.map((strategy) => (
                <Card key={strategy.id} className="border-orange-200 hover:border-orange-300 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg text-gray-900 line-clamp-1">
                          {strategy.business_name || 'Untitled Strategy'}
                        </CardTitle>
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
                      {/* Desktop actions */}
                      <div className="hidden md:flex gap-2 flex-wrap">
                        <Button
                          size="sm"
                          onClick={() => {
                            console.log('DASHBOARD DEBUG: View button clicked, strategy.id:', strategy.id);
                            console.log('DASHBOARD DEBUG: Full strategy object:', strategy);
                            handleViewStrategy(strategy);
                          }}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            console.log('DASHBOARD DEBUG: Edit button clicked, strategy.id:', strategy.id);
                            console.log('DASHBOARD DEBUG: Full strategy object:', strategy);
                            handleViewStrategy(strategy);
                          }}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleUpdateMilestones(strategy.id)}
                        >
                          <Target className="w-3 h-3 mr-1" />
                          Milestones
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleUpdateFinancials(strategy.id)}
                        >
                          <DollarSign className="w-3 h-3 mr-1" />
                          Financials
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteStrategy(strategy.id)}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>

                      {/* Mobile actions */}
                      <div className="flex md:hidden gap-2 w-full">
                        <Button
                          size="sm"
                          onClick={() => {
                            console.log('DASHBOARD DEBUG: View button clicked, strategy.id:', strategy.id);
                            console.log('DASHBOARD DEBUG: Full strategy object:', strategy);
                            handleViewStrategy(strategy);
                          }}
                          className="flex-1"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            console.log('DASHBOARD DEBUG: Edit button clicked, strategy.id:', strategy.id);
                            console.log('DASHBOARD DEBUG: Full strategy object:', strategy);
                            handleViewStrategy(strategy);
                          }}
                          className="flex-1"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>

                        {/* More menu */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline">
                              <MoreVertical className="w-3 h-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-background border z-50">
                            <DropdownMenuItem onClick={() => handleUpdateMilestones(strategy.id)}>
                              <Target className="w-4 h-4 mr-2" />
                              Update Milestones
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateFinancials(strategy.id)}>
                              <DollarSign className="w-4 h-4 mr-2" />
                              Update Financials
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDownloadReport}>
                              <Download className="w-4 h-4 mr-2" />
                              Download Report
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleShareReport}>
                              <Share2 className="w-4 h-4 mr-2" />
                              Share Report
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteStrategy(strategy.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>



      </div>

      {/* Report Modal */}
      <ReportModal
        open={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onConfirm={handleReportConfirm}
        mode={reportMode}
      />
    </div>
  );
};

export default UserDashboard;
