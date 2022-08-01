import { createClient } from '@supabase/supabase-js';

export const supabase = (supabaseUrl: string, supabaseAnonKey: string) =>
  createClient(supabaseUrl, supabaseAnonKey);
