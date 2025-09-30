import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Copy, Plus, Mail, Clock, CheckCircle, XCircle, Building2, Users, LogIn } from 'lucide-react';

// Type definitions
interface UserRole {
  id: string;
  user_id: string;
  role: string;
  hub_id: string | null;
  created_at: string;
}

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  updated_at?: string;
  roles: UserRole[];
}

interface InviteCode {
  id: string;
  code: string;
  invited_email: string;
  account_type: 'business' | 'organization';
  used_at: string | null;
  used_by: string | null;
  expires_at: string;
  created_at: string;
}

export function InviteCodeManager() {
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newInvite, setNewInvite] = useState({
    email: '',
    accountType: 'business' as 'business' | 'organization'
  });
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const { toast } = useToast();

  // Fetch user profile and roles
  const fetchUserProfile = useCallback(async () => {
    setLoadingProfile(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!user) return;

      // Fetch profile and roles in parallel
      const [
        { data: profile, error: profileError },
        { data: roles, error: rolesError }
      ] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single(),
        supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', user.id)
      ]);

      if (profileError) throw profileError;
      if (rolesError) throw rolesError;

      setUserProfile({
        ...profile,
        roles: roles || []
      });

      return {
        profile,
        roles: roles || []
      };
    } catch (error) {
      console.error('Error in fetchUserProfile:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      toast({
        title: "Error",
        description: "Failed to load user profile",
        variant: "destructive",
      });
    } finally {
      setLoadingProfile(false);
    }
  }, [toast]);

  // Fetch invite codes
  const fetchInviteCodes = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('invite_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInviteCodes((data || []) as InviteCode[]);
    } catch (error) {
      console.error('Error fetching invite codes:', error);
      toast({
        title: "Error",
        description: "Failed to load invite codes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const generateInviteCode = async () => {
    if (!newInvite.email) {
      toast({
        title: 'Email Required',
        description: 'Please enter an email address',
        variant: 'destructive',
      });
      return;
    }

    setCreating(true);
    try {
      const code = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const { error } = await supabase
        .from('invite_codes')
        .insert([
          {
            code,
            invited_email: newInvite.email,
            account_type: newInvite.accountType,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          },
        ]);

      if (error) throw error;

      toast({
        title: 'Invite code created!',
        description: `Invite code for ${newInvite.email} has been generated.`,
      });

      // Reset form and refresh list
      setNewInvite({ email: '', accountType: 'business' });
      await fetchInviteCodes();
    } catch (error) {
      console.error('Error generating invite code:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate invite code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied!',
        description: 'Invite code copied to clipboard',
      });
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const getStatusBadge = (invite: InviteCode) => {
    if (invite.used_at) {
      return (
        <Badge variant="secondary" className="gap-1">
          <CheckCircle className="w-3 h-3" />
          Used
        </Badge>
      );
    }

    const isExpired = new Date(invite.expires_at) < new Date();
    if (isExpired) {
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="w-3 h-3" />
          Expired
        </Badge>
      );
    }

    return (
      <Badge variant="default" className="gap-1">
        <Clock className="w-3 h-3" />
        Active
      </Badge>
    );
  };

  // Initial data loading
  useEffect(() => {
    const loadData = async () => {
      await fetchUserProfile();
      await fetchInviteCodes();
    };
    loadData();
  }, [fetchUserProfile, fetchInviteCodes]);

  // Loading state
  if (loading || loadingProfile) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Check if user can create invite codes
  const canCreateInvites = userProfile?.roles?.some(role => 
    ['admin', 'super_admin', 'hub_manager'].includes(role.role)
  ) || userProfile?.account_type === 'organization';

  if (!canCreateInvites) {
    return (
      <Alert>
        <XCircle className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to manage invite codes. Only organizations and administrators can create invites.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Create Invite Code</CardTitle>
              <CardDescription>
                Generate invite codes for new users to join your organization
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email Address</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="user@example.com"
                value={newInvite.email}
                onChange={(e) => setNewInvite({ ...newInvite, email: e.target.value })}
              />
            </div>

            <div className="space-y-3">
              <Label>Account Type</Label>
              <RadioGroup 
                value={newInvite.accountType}
                onValueChange={(value: 'business' | 'organization') => 
                  setNewInvite({ ...newInvite, accountType: value })
                }
              >
                <div className="flex items-center space-x-2 p-2 rounded border hover:bg-accent/50">
                  <RadioGroupItem value="business" id="invite-business" />
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="invite-business">Business Account</Label>
                </div>
                {userProfile?.roles?.some(role => 
                  ['admin', 'super_admin'].includes(role.role)
                ) && (
                  <div className="flex items-center space-x-2 p-2 rounded border hover:bg-accent/50">
                    <RadioGroupItem value="organization" id="invite-organization" />
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="invite-organization">Organization Account</Label>
                  </div>
                )}
              </RadioGroup>
            </div>

            <Button 
              onClick={generateInviteCode}
              disabled={creating}
              className="w-full"
            >
              {creating ? "Creating..." : "Generate Invite Code"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invite Codes</CardTitle>
          <CardDescription>
            Manage and track your generated invite codes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading invite codes...</div>
          ) : inviteCodes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No invite codes created yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inviteCodes.map((invite) => (
                  <TableRow key={invite.id}>
                    <TableCell className="font-medium">{invite.invited_email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {invite.account_type === 'business' ? (
                          <><Building2 className="w-3 h-3 mr-1" />Business</>
                        ) : (
                          <><Users className="w-3 h-3 mr-1" />Organization</>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {invite.code}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(invite)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(invite.expires_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(invite.code)}
                        disabled={!!invite.used_at}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}