import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Copy, Mail, Clock, CheckCircle, XCircle, Building2, Users } from 'lucide-react';

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
  email: string | null;
  full_name: string | null;
  avatar_url?: string | null;
  updated_at?: string | null;
  roles: UserRole[];
  account_type?: string | null;
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
  const [showRegistrationLinkModal, setShowRegistrationLinkModal] = useState(false);
  const [lastRegistrationLink, setLastRegistrationLink] = useState<string | null>(null);
  const [newInvite, setNewInvite] = useState({
    email: '',
    accountType: 'business' as 'business' | 'organization'
  });
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const { toast } = useToast();

  // Fetch user profile and roles
  const fetchUserProfile = useCallback(async (): Promise<void> => {
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
      // get current user id for created_by
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('invite_codes')
        .insert([
          {
            code,
            invited_email: newInvite.email,
            account_type: newInvite.accountType,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
            created_by: user?.id || ''
          },
        ]);

      if (error) throw error;

      // Send email with link to register (one-click link) - best-effort
      try {
        const appUrl = window.location.origin;
        const registerUrl = `${appUrl}/register?invite_code=${encodeURIComponent(code)}&email=${encodeURIComponent(newInvite.email)}`;

        // Determine functions base: prefer injected env variables; fall back to Vite env or Netlify-style functions
        const metaEnv = (typeof import.meta !== 'undefined' ? (import.meta as any).env : {}) || {};
        const functionsBase = (window as any).__SUPABASE_FUNCTIONS_URL__
          || metaEnv.VITE_SUPABASE_FUNCTIONS_URL
          || (metaEnv.VITE_SUPABASE_PROJECT_REF ? `https://${metaEnv.VITE_SUPABASE_PROJECT_REF}.functions.supabase.co` : window.location.origin);

        // Improved email payload: include subject, plain text and html body
        const payload = {
          email: newInvite.email,
          confirmationUrl: registerUrl,
          subject: 'You were invited to join Jenga',
          text: `You have been invited to join Jenga. Click or paste this link to register: ${registerUrl}`,
          html: `<p>You have been invited to join <strong>Jenga</strong>.</p><p>Click the link below to complete registration:</p><p><a href="${registerUrl}">${registerUrl}</a></p><p>If you prefer, copy this invite code: <code>${code}</code></p>`
        };

        await fetch(`${functionsBase}/send-signup-confirmation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (e) {
        // best-effort; don't block
        console.error('Failed to send invite email:', e);
      }
        const appUrl = window.location.origin;
        const registerUrl = `${appUrl}/register?invite_code=${encodeURIComponent(code)}&email=${encodeURIComponent(newInvite.email)}`;

        // show the registration link modal so admin can copy/send it immediately
        setLastRegistrationLink(registerUrl);
        setShowRegistrationLinkModal(true);

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

  const sendInviteEmail = async (invite: InviteCode) => {
    try {
      const appUrl = window.location.origin;
      const registerUrl = `${appUrl}/register?invite_code=${encodeURIComponent(invite.code)}&email=${encodeURIComponent(invite.invited_email)}`;
      const metaEnv = (typeof import.meta !== 'undefined' ? (import.meta as any).env : {}) || {};
      const functionsBase = (window as any).__SUPABASE_FUNCTIONS_URL__
        || metaEnv.VITE_SUPABASE_FUNCTIONS_URL
        || (metaEnv.VITE_SUPABASE_PROJECT_REF ? `https://${metaEnv.VITE_SUPABASE_PROJECT_REF}.functions.supabase.co` : window.location.origin);

      const payload = {
        email: invite.invited_email,
        confirmationUrl: registerUrl,
        subject: 'You were invited to join Jenga',
        text: `You have been invited to join Jenga. Register here: ${registerUrl}`,
        html: `<p>You have been invited to join <strong>Jenga</strong>.</p><p>Click the link below to complete registration:</p><p><a href="${registerUrl}">${registerUrl}</a></p><p>Invite code: <code>${invite.code}</code></p>`
      };

      const resp = await fetch(`${functionsBase}/send-signup-confirmation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!resp.ok) throw new Error('Email send failed');

      toast({ title: 'Email sent', description: `Invite sent to ${invite.invited_email}` });
    } catch (e) {
      console.error('Failed to send invite email:', e);
      toast({ title: 'Email failed', description: 'Could not send invite email', variant: 'destructive' });
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

      {/* Registration link modal shown after creating an invite */}
      <Dialog open={showRegistrationLinkModal} onOpenChange={setShowRegistrationLinkModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-2">
            <p className="text-sm text-gray-600">Share this link with the invited user to allow one-click registration.</p>
            <div className="bg-slate-50 p-3 rounded border font-mono text-sm break-all">{lastRegistrationLink}</div>
            <div className="flex items-center gap-2">
              <Button
                onClick={async () => {
                  if (!lastRegistrationLink) return;
                  try {
                    await navigator.clipboard.writeText(lastRegistrationLink);
                    toast({ title: 'Copied', description: 'Registration link copied to clipboard' });
                  } catch (e) {
                    console.error('Failed to copy registration link', e);
                    toast({ title: 'Copy failed', description: 'Could not copy link', variant: 'destructive' });
                  }
                }}
              >
                <Copy className="w-4 h-4 mr-2" /> Copy link
              </Button>

              <Button
                variant="ghost"
                onClick={() => setShowRegistrationLinkModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
                    <TableCell className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(invite.code)}
                        disabled={!!invite.used_at}
                        title="Copy invite code"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const appUrl = window.location.origin;
                          const registerUrl = `${appUrl}/register?invite_code=${encodeURIComponent(invite.code)}&email=${encodeURIComponent(invite.invited_email)}`;
                          copyToClipboard(registerUrl);
                          toast({ title: 'Link copied', description: 'Registration link copied to clipboard' });
                        }}
                        disabled={!!invite.used_at}
                        title="Copy registration link"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => sendInviteEmail(invite)}
                        disabled={!!invite.used_at}
                        title="Send invite email"
                      >
                        <Mail className="w-4 h-4" />
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