import { supabase } from '@/integrations/supabase/client';

function normalizeAccountType(value: any): 'business' | 'organization' {
  const v = String(value || '').toLowerCase();
  if (['organization', 'ecosystem enabler', 'enabler', 'org'].includes(v)) return 'organization';
  return 'business';
}

export async function saveProfileForUser(userId: string, profileData: Record<string, any>) {
  try {
    const payload = { id: userId, ...profileData } as any;
    if (payload.account_type !== undefined) {
      payload.account_type = normalizeAccountType(payload.account_type);
    }
    const { data, error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();
    if (error) {
      const msg = (error as any)?.message || (error as any)?.details || JSON.stringify(error);
      return { data: null, error: { message: msg } } as any;
    }
    return { data, error: null } as any;
  } catch (e: any) {
    const msg = e?.message || JSON.stringify(e);
    return { data: null, error: { message: msg } } as any;
  }
}
