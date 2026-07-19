const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://nmdtstokwzntxukbnyen.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tZHRzdG9rd3pudHh1a2JueWVuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODIxOTg2NiwiZXhwIjoyMDUzNzk1ODY2fQ..."; // Wait, I don't know the service role key!

console.log("To test properly, we need the service key or we can just hit a live endpoint.");
