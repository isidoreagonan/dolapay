import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  
  const res = await fetch(`${url}/rest/v1/profiles?id=ilike.46179a95-999b-409d-%&select=id`, {
    headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
  });
  const data = await res.json();
  if (data && data.length > 0) {
    const profileId = data[0].id;
    console.log("Found profile", profileId);
    
    const syncRes = await fetch(`https://dola-pay.com/api/public/sync-wallet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: profileId })
    });
    console.log(await syncRes.json());
  } else {
    console.log("No profile found", data);
  }
}
run();
