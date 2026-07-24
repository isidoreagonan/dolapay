const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  "https://sdieqwzrggypjpkjiogg.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkaWVxd3pyZ2d5cGpwa2ppb2dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwNTg5OTcsImV4cCI6MjA5NzYzNDk5N30.IFvtiL64qQUhrmZRit5mSzaLB_YdgfTpdJwc3OSjTJs"
);

async function test() {
  const { data, error } = await supabase.from("transactions").select("*").limit(10);
  console.log("data:", data);
  console.log("error:", error);
}
test();
