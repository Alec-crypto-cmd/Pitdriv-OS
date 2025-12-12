import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://shdpkkbjukfsukbgrkug.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoZHBra2JqdWtmc3VrYmdya3VnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1MzQ2NTMsImV4cCI6MjA4MTExMDY1M30.j-Mnx1RoR3w7DUUPUEvFwAtveMbGbQRinf7kTcaSis0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
