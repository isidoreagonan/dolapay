const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  "https://sdieqwzrggypjpkjiogg.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkaWVxd3pyZ2d5cGpwa2ppb2dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwNTg5OTcsImV4cCI6MjA5NzYzNDk5N30.IFvtiL64qQUhrmZRit5mSzaLB_YdgfTpdJwc3OSjTJs"
);

async function test() {
  // Let's first test the query exactly as it is in the admin index
  const { data, error } = await supabase
    .from("transactions")
    .select("id,amount,status,type,created_at,profile_id,dola_margin,description,currency,net_amount,payment_method,customer_phone,provider,profiles(id,full_name,email)")
    .limit(1);

  console.log("Error:", error);
  if (data && data.length > 0) {
    console.log("Keys in transactions:", Object.keys(data[0]));
    console.log("Row:", data[0]);
  } else {
    console.log("No data returned or error.");
  }
}

test();
