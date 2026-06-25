// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { createClient as _createClient, SupabaseClient } from '@supabase/supabase-js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _instance: SupabaseClient<any> | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createClient(): SupabaseClient<any> {
  if (!_instance) {
    const url = 'https://rsbzgeqgfseyeogexkwk.supabase.co';
    const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzYnpnZXFnZnNleWVvZ2V4a3drIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzNTkxOTYsImV4cCI6MjA5NzkzNTE5Nn0.QsQjaOPnUj5GyEk5Qb_l0vLFOZQ96hO_QrQI382wZaE';
    _instance = _createClient(url, key, { auth: { persistSession: true, storageKey: 'omt-admin-session' } });
  }
  return _instance;
}
