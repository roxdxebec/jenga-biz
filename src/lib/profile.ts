import { supabase } from '@/integrations/supabase/client';

export async function saveProfileForUser(userId: string, profileData: Record<string, any>) {
  const payload = {
    id: userId, // profiles table uses id as primary key, not user_id
    ...profileData,
  };
  
  const { data, error } = await supabase
    .from('profiles')
    .upsert(payload, { onConflict: 'id' })
    .select()
    .single();
    
  return { data, error };
}