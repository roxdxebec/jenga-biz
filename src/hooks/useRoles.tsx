import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export type UserRole = 'entrepreneur' | 'hub_manager' | 'admin' | 'super_admin';

export function useRoles() {
  const { user } = useAuth();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setRoles([]);
        return;
      }
      setLoading(true);
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      if (!error) {
        setRoles((data || []).map(r => r.role as UserRole));
      } else {
        setRoles([]);
      }
      setLoading(false);
    };
    load();
  }, [user?.id]);

  return { roles, loading };
}
