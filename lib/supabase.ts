import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://crdbptnbictuwxbwwswy.supabase.co';
const supabaseKey = 'sb_publishable_TklEUZEnfN8sdk5ymSpU0g_5ULxd-64';

export const supabase = createClient(supabaseUrl, supabaseKey);
