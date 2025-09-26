import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { FinancialInsightsDashboard } from '@/components/analytics/FinancialInsightsDashboard';
import { ImpactMeasurementDashboard } from '@/components/analytics/ImpactMeasurementDashboard';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { InviteCodeManager } from '@/components/auth/InviteCodeManager';
import { HubConfigDialog } from '@/components/Hubs/HubConfigDialog';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  FileText, 
  Settings, 
  LogOut,
  Building2,
  Target,
  DollarSign
} from 'lucide-react';

interface SaaSFeaturesProps {
  onSignOut: () => void;
}

const SaaSFeatures = ({ onSignOut }: SaaSFeaturesProps) => {
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [analyticsPanel, setAnalyticsPanel] = useState<string | undefined>(undefined);
  const [showInvite, setShowInvite] = useState(false);
  const [showHubConfig, setShowHubConfig] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // Initialize from URL query params: ?tab=analytics&panel=reporting
    const tab = searchParams.get('tab');
    const panel = searchParams.get('panel');
    if (tab) setActiveTab(tab);
    if (tab === 'analytics' && panel) {
      setAnalyticsPanel(panel);
    }
  }, []);

  const handleSignOut = async () => {
    await signOut();
    onSignOut();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <Building2 className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Ecosystem Enabler Dashboard</h1>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => setShowHubConfig(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-4 p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Financial
            </TabsTrigger>
            <TabsTrigger value="impact" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Impact
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Admin
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Businesses</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">892</div>
                  <p className="text-xs text-muted-foreground">+8% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue Impact</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$2.4M</div>
                  <p className="text-xs text-muted-foreground">+15% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87%</div>
                  <p className="text-xs text-muted-foreground">+3% from last month</p>
                </CardContent>
              </Card>
            </div>
            
            <Separator />
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <Button className="h-24 flex-col gap-2" variant="outline" onClick={() => setActiveTab('analytics')}>
                    <FileText className="h-6 w-6" />
                    Generate Report
                  </Button>
                  <Button className="h-24 flex-col gap-2" variant="outline" onClick={() => setShowInvite(true)}>
                    <Users className="h-6 w-6" />
                    Invite Users
                  </Button>
                  <Button className="h-24 flex-col gap-2" variant="outline" onClick={() => setShowHubConfig(true)}>
                    <Settings className="h-6 w-6" />
                    Configure Hub
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="financial">
            <FinancialInsightsDashboard />
          </TabsContent>

          <TabsContent value="impact">
            <ImpactMeasurementDashboard />
          </TabsContent>

          <TabsContent value="admin">
            <AdminDashboard saasMode />
          </TabsContent>
        </Tabs>

        {/* Invite Users Dialog */}
        <Dialog open={showInvite} onOpenChange={setShowInvite}>
          <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Invite Users</DialogTitle>
            </DialogHeader>
            <InviteCodeManager />
          </DialogContent>
        </Dialog>

        {/* Configure Hub Dialog */}
        <HubConfigDialog open={showHubConfig} onOpenChange={setShowHubConfig} />
      </div>
    </div>
  );
};

export default SaaSFeatures;
