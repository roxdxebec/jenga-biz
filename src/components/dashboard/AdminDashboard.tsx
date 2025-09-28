import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Building, 
  TrendingUp, 
  Settings, 
  Shield,
  BarChart3,
  Globe2,
  PlusCircle 
} from "lucide-react";
import { InviteCodeManager } from "../auth/InviteCodeManager";
import { AnalyticsDashboard } from "../analytics/AnalyticsDashboard";
import { UserManagement } from "./UserManagement";
import { Switch } from '@/components/ui/switch';
import { useAppSettings } from '@/hooks/useAppSettings';
import { PendingApprovalsList } from '../admin/PendingApprovalsList';

interface UserRole {
  role: string;
  user_id: string;
}

export function AdminDashboard({ saasMode = false }: { saasMode?: boolean }) {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBusinesses: 0,
    activeUsers: 0,
    totalRevenue: 0
  });

  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
  const [autoApproveOrgs, setAutoApproveOrgs] = useState<boolean>(false);
  const { getAutoApprove, setAutoApprove, loading: settingsLoading, error: settingsError } = useAppSettings();

  const loadSettings = async () => {
    const value = await getAutoApprove();
    setAutoApproveOrgs(value);
  };

  const saveSettings = async () => {
    const success = await setAutoApprove(autoApproveOrgs);
    if (success) {
      toast({ title: 'Settings saved', description: 'System settings updated successfully.' });
    } else if (settingsError) {
      toast({ title: 'Save failed', description: settingsError, variant: 'destructive' });
    }
  };

  useEffect(() => {
    checkAdminStatus();
    fetchStats();
  }, [user]);

  const checkAdminStatus = async () => {
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
      const allowed = !!adminRole;
      setIsAdmin(allowed);

      // store detailed roles
      setUserRoles((data || []).map((r: any) => ({ role: r.role, user_id: user.id })));
      // determine super admin
      const superAdmin = (data || []).some((r: any) => r.role === 'super_admin');
      setIsSuperAdmin(superAdmin);
      // load system settings
      await loadSettings();

      if (!allowed) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges. Please contact support.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Determine super admin ids if in saasMode
      let superAdminIds: string[] = [];
      if (saasMode) {
        const { data: sa, error: saError } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'super_admin');
        if (!saError && sa) {
          superAdminIds = sa.map((r: any) => r.user_id);
        }
      }

      // Helper to build not-in filter for profiles
      const notInFilter = superAdminIds.length > 0 ? `(${superAdminIds.map((id) => `"${id}"`).join(',')})` : null;

      // Get total users
      const profilesQuery = supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      const { count: userCount } = notInFilter
        ? await profilesQuery.not('id', 'in', notInFilter)
        : await profilesQuery;

      // Get total businesses
      const { count: businessCount } = await supabase
        .from('businesses')
        .select('*', { count: 'exact', head: true });

      // Get active users (users who logged in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const activitiesQuery = supabase
        .from('user_activities')
        .select('*', { count: 'exact', head: true })
        .eq('activity_type', 'login')
        .gte('created_at', thirtyDaysAgo.toISOString());
      const { count: activeCount } = notInFilter
        ? await activitiesQuery.not('user_id', 'in', notInFilter)
        : await activitiesQuery;

      // Get total revenue from financial records
      const { data: revenueData } = await supabase
        .from('financial_records')
        .select('revenue')
        .not('revenue', 'is', null);

      const totalRevenue = revenueData?.reduce((sum, record) =>
        sum + (Number(record.revenue) || 0), 0) || 0;

      setStats({
        totalUsers: userCount || 0,
        totalBusinesses: businessCount || 0,
        activeUsers: activeCount || 0,
        totalRevenue
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Please Sign In</CardTitle>
            <CardDescription>You need to be authenticated to access the dashboard</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isAdmin === null) {
    return null;
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Access Restricted
            </CardTitle>
            <CardDescription>
              You don't have admin privileges to access this dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleSignOut} variant="outline" className="w-full">
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <img src="/jenga-biz-logo.png" alt="Jenga Biz Africa" className="h-12 w-auto" />
            <p className="text-sm text-muted-foreground">Admin Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user.email}
            </span>
            <Button onClick={handleSignOut} variant="outline">
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Businesses</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBusinesses}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users (30d)</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="invites" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Invite Codes
            </TabsTrigger>
            {isSuperAdmin && (
              <TabsTrigger value="approvals" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Approvals
              </TabsTrigger>
            )}
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <UserManagement hideSuperAdmins={saasMode} />
          </TabsContent>

          <TabsContent value="invites" className="space-y-6">
            <InviteCodeManager />
          </TabsContent>

          {isSuperAdmin && (
            <TabsContent value="approvals" className="space-y-6">
              <PendingApprovalsList />
            </TabsContent>
          )}

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure system-wide settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Auto-approve Organization Accounts</h3>
                      <p className="text-sm text-muted-foreground">When enabled, newly registered ecosystem enablers will be activated automatically. Otherwise, they will remain pending approval.</p>
                    </div>
                    <div>
                      {/* Switch */}
                      <Switch
                        checked={autoApproveOrgs}
                        onCheckedChange={(val: any) => setAutoApproveOrgs(!!val)}
                        disabled={!isSuperAdmin || settingsLoading}
                      />
                    </div>
                  </div>
                  <div>
                    {!isSuperAdmin && (
                      <p className="text-sm text-muted-foreground">Only super admins can change this setting.</p>
                    )}
                    <div className="mt-2 flex gap-2">
                      <Button
                        onClick={saveSettings}
                        disabled={!isSuperAdmin || settingsLoading}
                      >
                        {settingsLoading ? 'Saving...' : 'Save'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Super Admin: list of organizations (hubs) for impersonation */}
            <HubsList />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
