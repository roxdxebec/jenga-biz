import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const FALLBACK_SUPABASE_URL = 'https://diclwatocrixibjpajuf.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY = 'sb_publishable_jxkcVxCHRtx5DSxitJLqUg_5eDy5ZWi';

const envSupabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const envSupabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

export const SUPABASE_URL = (envSupabaseUrl && envSupabaseUrl.replace(/\/$/, ''))
  || FALLBACK_SUPABASE_URL.replace(/\/$/, '');

export const SUPABASE_ANON_KEY = envSupabaseAnonKey || FALLBACK_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    storage: localStorage,
    autoRefreshToken: true,
  },
});
