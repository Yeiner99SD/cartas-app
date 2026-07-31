import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://qdzgtxfcmyupvmgxjwyn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkemd0eGZjbXl1cHZtZ3hqd3luIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwOTAyNzEsImV4cCI6MjA3NjY2NjI3MX0.mnZ8oaeC2zxCSL_utFfGGXSYNooaBdC64AYdqZjGt2g";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase as s };
