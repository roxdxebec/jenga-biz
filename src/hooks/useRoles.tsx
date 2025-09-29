import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api-client';

export type UserRole = 'entrepreneur' | 'hub_manager' | 'admin' | 'super_admin';

export function useRoles() {
  const { user } = useAuth();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setRoles([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const profile = await apiClient.getProfile();
        if (profile?.roles) {
          setRoles(profile.roles as UserRole[]);
        } else {
          setRoles([]);
        }
      } catch (error) {
        console.error('Failed to load user roles:', error);
        setRoles([]);
      }
      setLoading(false);
    };
    load();
  }, [user?.id]);

  return { roles, loading };
}
