const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

async function run() {
  const userId = '46179a95-999b-469d-915d-718bae54a844';
  
  const { data, error } = await supabase.auth.admin.getUserById(userId);
    
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("User metadata:", data.user.user_metadata);
  }
}

run();
