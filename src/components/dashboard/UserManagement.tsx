import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Users, UserPlus, Edit, Trash2, Search, Shield } from "lucide-react";

interface UserWithRoles {
  id: string;
  email: string;
  full_name: string;
  account_type: string;
  country: string | null;
  organization_name: string | null;
  created_at: string;
  roles: string[];
}

export function UserManagement() {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editValues, setEditValues] = useState<{ full_name: string; email: string; account_type: string; country: string; organization_name: string }>({ full_name: "", email: "", account_type: "", country: "", organization_name: "" });
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Combine data
      const usersWithRoles: UserWithRoles[] = profiles?.map((profile: any) => ({
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        account_type: profile.account_type,
        country: profile.country,
        organization_name: profile.organization_name,
        created_at: profile.created_at,
        roles: userRoles?.filter((role: any) => role.user_id === profile.id).map((role: any) => role.role) || []
      })) || [];

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'entrepreneur' | 'hub_manager' | 'admin' | 'super_admin', action: 'add' | 'remove') => {
    try {
      if (action === 'add') {
        const { data, error } = await supabase.rpc('add_user_role_with_audit', {
          target_user_id: userId,
          new_role: newRole,
          requester_ip: null,
          requester_user_agent: navigator.userAgent
        });
        
        if (error) throw error;
        if (!data) {
          toast({
            title: "Info",
            description: "User already has this role",
          });
          return;
        }
      } else {
        const { data, error } = await supabase.rpc('remove_user_role_with_audit', {
          target_user_id: userId,
          old_role: newRole,
          requester_ip: null,
          requester_user_agent: navigator.userAgent
        });
        
        if (error) throw error;
        if (!data) {
          toast({
            title: "Info",
            description: "User doesn't have this role",
          });
          return;
        }
      }

      await fetchUsers();
      toast({
        title: "Success",
        description: `User role ${action === 'add' ? 'added' : 'removed'} successfully`,
      });
    } catch (error: any) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const handleOpenEdit = (user: UserWithRoles) => {
    setSelectedUser(user);
    setEditValues({
      full_name: user.full_name || "",
      email: user.email || "",
      account_type: user.account_type || "",
      country: user.country || "",
      organization_name: user.organization_name || "",
    });
    setIsEditModalOpen(true);
  };

  const saveProfileChanges = async () => {
    if (!selectedUser) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editValues.full_name,
          email: editValues.email,
          account_type: editValues.account_type,
          country: editValues.country || null,
          organization_name: editValues.organization_name || null,
        })
        .eq('id', selectedUser.id);

      if (error) throw error;
      toast({ title: 'Updated', description: 'Profile updated successfully' });
      await fetchUsers();
      setIsEditModalOpen(false);
      setSelectedUser(null);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to update profile', variant: 'destructive' });
    }
  };

  const deactivateUser = async (userId: string) => {
    try {
      const { error: rolesError } = await supabase.from('user_roles').delete().eq('user_id', userId);
      if (rolesError) throw rolesError;
      const { error: profileError } = await supabase.from('profiles').update({ account_type: 'deactivated' }).eq('id', userId);
      if (profileError) throw profileError;
      toast({ title: 'Deactivated', description: 'User roles removed and account marked deactivated' });
      await fetchUsers();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to deactivate user', variant: 'destructive' });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || user.roles.includes(filterRole);
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'admin': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'hub_manager': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'entrepreneur': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">User Management</h2>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Super Admins</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.roles.includes('super_admin')).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.roles.includes('admin')).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hub Managers</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.roles.includes('hub_manager')).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="search">Search Users</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by email or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="role-filter">Filter by Role</Label>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="hub_manager">Hub Manager</SelectItem>
                <SelectItem value="entrepreneur">Entrepreneur</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>Manage user accounts and their roles</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading users...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Account Type</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.full_name || 'No name'}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.account_type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles.length > 0 ? (
                          user.roles.map((role) => (
                            <Badge key={role} className={getRoleColor(role)}>
                              {role}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="secondary">No roles</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Dialog 
                        open={isEditModalOpen && selectedUser?.id === user.id}
                        onOpenChange={(open) => {
                          setIsEditModalOpen(open);
                          if (!open) setSelectedUser(null);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEdit(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Manage User</DialogTitle>
                            <DialogDescription>
                              Update profile or roles for {user.email}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="full_name">Full Name</Label>
                                <Input id="full_name" value={editValues.full_name} onChange={(e) => setEditValues(v => ({ ...v, full_name: e.target.value }))} />
                              </div>
                              <div>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" value={editValues.email} onChange={(e) => setEditValues(v => ({ ...v, email: e.target.value }))} />
                              </div>
                              <div>
                                <Label>Account Type</Label>
                                <Select value={editValues.account_type} onValueChange={(val) => setEditValues(v => ({ ...v, account_type: val }))}>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="business">Business</SelectItem>
                                    <SelectItem value="organization">Organization</SelectItem>
                                    <SelectItem value="deactivated">Deactivated</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="country">Country</Label>
                                <Input id="country" value={editValues.country} onChange={(e) => setEditValues(v => ({ ...v, country: e.target.value }))} />
                              </div>
                              <div className="md:col-span-2">
                                <Label htmlFor="organization_name">Organization</Label>
                                <Input id="organization_name" value={editValues.organization_name} onChange={(e) => setEditValues(v => ({ ...v, organization_name: e.target.value }))} />
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button onClick={saveProfileChanges}>Save</Button>
                              <Button variant="destructive" onClick={() => deactivateUser(user.id)}>
                                <Trash2 className="h-4 w-4 mr-1" /> Deactivate
                              </Button>
                            </div>

                            <div className="space-y-4 border-t pt-4">
                              <div>
                                <Label>Current Roles</Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {user.roles.map((role) => (
                                    <div key={role} className="flex items-center gap-2">
                                      <Badge className={getRoleColor(role)}>{role}</Badge>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => updateUserRole(user.id, role as any, 'remove')}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <Label>Add Role</Label>
                                <div className="flex gap-2 mt-2 flex-wrap">
                                  {['entrepreneur', 'hub_manager', 'admin', 'super_admin'].map((role) => (
                                    !user.roles.includes(role) && (
                                      <Button
                                        key={role}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => updateUserRole(user.id, role as any, 'add')}
                                      >
                                        <UserPlus className="h-3 w-3 mr-1" />
                                        {role}
                                      </Button>
                                    )
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
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
