import { supabase } from '@/integrations/supabase/client';

export async function saveProfileForUser(userId: string, profileData: Record<string, any>) {
  try {
    const payload = { id: userId, ...profileData };
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
