import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://diclwatocrixibjpajuf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_jxkcVxCHRtx5DSxitJLqUg_5eDy5ZWi";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    storage: localStorage,
    autoRefreshToken: true,
  },
});