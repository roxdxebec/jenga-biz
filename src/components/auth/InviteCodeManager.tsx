// @ts-nocheck
import { useState, useEffect } from 'react';
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
import { Copy, Plus, Mail, Clock, CheckCircle, XCircle, Building2, Users } from 'lucide-react';

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
  const [userProfile, setUserProfile] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserProfile();
    fetchInviteCodes();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*, user_roles(*)')
        .eq('id', user.id)
        .single();

      setUserProfile(profile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchInviteCodes = async () => {
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
        description: "Failed to fetch invite codes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateInviteCode = async () => {
    if (!newInvite.email) {
      toast({
        title: "Email Required",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);
    
    try {
      // Generate a unique invite code
      const code = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      const { error } = await supabase
        .from('invite_codes')
        .insert({
          code,
          invited_email: newInvite.email,
          account_type: newInvite.accountType,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Invite Code Created!",
        description: `Invite code generated for ${newInvite.email}`,
      });

      setNewInvite({ email: '', accountType: 'business' });
      fetchInviteCodes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create invite code",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Invite code copied to clipboard",
    });
  };

  const getStatusBadge = (inviteCode: InviteCode) => {
    if (inviteCode.used_at) {
      return <Badge variant="secondary"><CheckCircle className="w-3 h-3 mr-1" />Used</Badge>;
    }
    
    const isExpired = new Date(inviteCode.expires_at) < new Date();
    if (isExpired) {
      return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Expired</Badge>;
    }
    
    return <Badge variant="default"><Clock className="w-3 h-3 mr-1" />Active</Badge>;
  };

  // Check if user can create invite codes
  const canCreateInvites = userProfile?.user_roles?.some((role: any) => 
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
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create Invite Code
          </CardTitle>
          <CardDescription>
            Generate invite codes for new users to join your organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
              {userProfile?.user_roles?.some((role: any) => 
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